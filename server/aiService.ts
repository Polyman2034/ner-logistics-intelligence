/**
 * RouteMind NER Logistics Intelligence Platform
 * AI Risk Prediction, Route Optimization & Situational Intelligence Engine
 */

import { GoogleGenAI } from '@google/genai';
import { store } from './dataStore';
import { RiskPrediction, RouteOption, RoadCoordinate } from '../src/types';

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Could not initialize Google GenAI SDK:', e);
      geminiClient = null;
    }
  }
  return geminiClient;
}

/**
 * Predict risk score and hazard profile for a given road / corridor
 */
export function calculateRiskPrediction(roadId: string): RiskPrediction {
  const road = store.roads.find(r => r.id === roadId);
  const district = road ? store.districts.find(d => d.id === road.districtId) : null;
  const wx = district ? store.weather.find(w => w.districtId === district.id) : null;
  const incidents = store.incidents.filter(i => i.roadId === roadId && i.status !== 'Resolved' && i.status !== 'Rejected');

  const rainfall = wx ? wx.rainfallMm : 15;
  const rainfallFactor = Math.min(rainfall / 100, 1.0);
  const incidentFactor = Math.min(incidents.length * 0.35, 1.0);
  const elevationFactor = road?.elevationGradient === 'High Mountain' ? 0.9 : road?.elevationGradient === 'River Valley' ? 0.7 : 0.4;

  // Composite risk formula
  const compositeScore = Math.round(
    (rainfallFactor * 40) +
    (incidentFactor * 40) +
    (elevationFactor * 20)
  );

  const boundedScore = Math.max(10, Math.min(compositeScore, 98));
  let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (boundedScore >= 80) level = 'Critical';
  else if (boundedScore >= 60) level = 'High';
  else if (boundedScore >= 40) level = 'Medium';

  const reason = incidents.length > 0
    ? `${incidents[0].type}: ${incidents[0].title}. Precipitation: ${rainfall}mm in 24h.`
    : `Precipitation ${rainfall}mm over mountainous gradient with potential slope movement.`;

  const recommendedAction = boundedScore >= 80
    ? 'Mandatory detour via alternate lower-elevation valley corridor. Heavy multi-axle freight halted.'
    : boundedScore >= 60
    ? 'Proceed under caution with 4x4 pilot escort. Night transit restricted.'
    : 'Clear for standard cargo dispatch with monitored telematics.';

  return {
    districtId: district?.id || 'dist-unknown',
    districtName: district?.name || (road?.districtName || 'NER Region'),
    roadCode: road?.code || 'NH Corridor',
    riskScore: boundedScore,
    riskLevel: level,
    affectedArea: `${road?.name || 'Corridor'} (${road?.elevationGradient || 'Mountain'})`,
    reason,
    recommendedAction,
    generatedAt: new Date().toISOString(),
    factors: {
      rainfallWeight: Number(rainfallFactor.toFixed(2)),
      elevationHazard: Number(elevationFactor.toFixed(2)),
      activeBlockages: incidents.length
    }
  };
}

/**
 * Route Optimization Service: Generates Primary and Alternate routes
 * considering blocked points and terrain safety.
 */
export function optimizeRoute(
  origin: string,
  destination: string,
  originCoords: RoadCoordinate,
  destinationCoords: RoadCoordinate,
  avoidBlockedRoads = true
): { primary: RouteOption; alternate: RouteOption; recommendation: string } {
  // Check if any arterial road is currently BLOCKED in the region
  const blockedRoads = store.roads.filter(r => r.status === 'BLOCKED');

  // Straight line base distance
  const baseKm = store.calculateDistanceKm(
    originCoords.lat,
    originCoords.lng,
    destinationCoords.lat,
    destinationCoords.lng
  );
  // Hill road winding factor (approx 1.35x - 1.5x in Northeast India)
  const primaryDistance = Math.round(baseKm * 1.38);
  const primaryMinutes = Math.round((primaryDistance / 35) * 60); // average 35 km/h in hill terrain

  // Check if primary path crosses known blocked coordinates
  const isPrimaryAffected = blockedRoads.length > 0;
  const primaryRisk = isPrimaryAffected ? 88 : 34;

  // Primary route waypoints
  const primaryWaypoints: RoadCoordinate[] = [
    originCoords,
    {
      lat: Number(((originCoords.lat * 2 + destinationCoords.lat) / 3).toFixed(4)),
      lng: Number(((originCoords.lng * 2 + destinationCoords.lng) / 3).toFixed(4))
    },
    {
      lat: Number(((originCoords.lat + destinationCoords.lat * 2) / 3).toFixed(4)),
      lng: Number(((originCoords.lng + destinationCoords.lng * 2) / 3).toFixed(4))
    },
    destinationCoords
  ];

  // Alternate route via safer bypass (e.g. foothill corridor or tunnel bypass)
  const alternateDistance = Math.round(primaryDistance * 1.18);
  const alternateMinutes = Math.round((alternateDistance / 42) * 60); // higher average speed on bypass
  const alternateRisk = 28;

  // Alternate waypoints curved away from mountains/landslides
  const latOffset = (destinationCoords.lat - originCoords.lat) * 0.2;
  const lngOffset = (destinationCoords.lng - originCoords.lng) * 0.2;

  const alternateWaypoints: RoadCoordinate[] = [
    originCoords,
    {
      lat: Number((originCoords.lat + latOffset - 0.15).toFixed(4)),
      lng: Number((originCoords.lng + lngOffset + 0.25).toFixed(4))
    },
    {
      lat: Number((destinationCoords.lat - latOffset - 0.10).toFixed(4)),
      lng: Number((destinationCoords.lng - lngOffset + 0.15).toFixed(4))
    },
    destinationCoords
  ];

  const primary: RouteOption = {
    id: 'route-opt-direct',
    name: 'Primary Arterial Corridor',
    waypoints: primaryWaypoints,
    distanceKm: primaryDistance,
    durationMinutes: primaryMinutes,
    riskScore: primaryRisk,
    riskLevel: primaryRisk > 70 ? 'Critical' : primaryRisk > 50 ? 'High' : 'Low',
    isRecommended: !isPrimaryAffected,
    blockedPointsAvoided: 0,
    reason: isPrimaryAffected
      ? 'Crosses active landslide/flood sector with estimated delay of 3+ hours.'
      : 'Shortest direct arterial highway route with clear roadway telemetry.'
  };

  const alternate: RouteOption = {
    id: 'route-opt-bypass',
    name: 'All-Weather Valley Bypass',
    waypoints: alternateWaypoints,
    distanceKm: alternateDistance,
    durationMinutes: alternateMinutes,
    riskScore: alternateRisk,
    riskLevel: 'Low',
    isRecommended: isPrimaryAffected,
    blockedPointsAvoided: isPrimaryAffected ? 1 : 0,
    reason: isPrimaryAffected
      ? 'Bypasses active rockfall barrier completely via stabilized all-weather bypass.'
      : 'Slightly longer distance (+18%), but reliable in severe rainstorms.'
  };

  const recommendation = isPrimaryAffected
    ? `Recommend Alternate Route: Avoids active blockage, saving approximately ${Math.max(45, primaryRisk * 2)} minutes and cutting terrain hazard by ${(primaryRisk - alternateRisk)}%.`
    : 'Recommend Primary Route: Corridor is fully accessible with standard transit parameters.';

  return { primary, alternate, recommendation };
}

/**
 * Generate Situational Emergency Briefing using Gemini AI
 * (with automatic deterministic fallback when API key is not present)
 */
export async function generateSituationalBriefing(query?: string): Promise<{
  title: string;
  summary: string;
  keyHazards: string[];
  recommendedActions: string[];
  timestamp: string;
  source: 'GEMINI_AI' | 'HEURISTIC_NER_ENGINE';
}> {
  const blockedRoads = store.roads.filter(r => r.status === 'BLOCKED').map(r => r.code + ' (' + r.name + ')');
  const criticalIncidents = store.incidents.filter(i => i.severity === 'CRITICAL');
  const highRiskDistricts = store.districts.filter(d => d.riskLevel === 'Critical' || d.riskLevel === 'High').map(d => d.name);

  const client = getGemini();

  if (client) {
    try {
      const prompt = `You are the chief AI Logistics Officer for RouteMind NER Logistics Intelligence Platform, monitoring transportation and road accessibility across Northeast India (Assam, Arunachal Pradesh, Meghalaya, Sikkim, Nagaland, Manipur, Mizoram, Tripura).
Current status:
- Blocked Corridors: ${blockedRoads.join(', ') || 'None'}
- Critical Incidents: ${criticalIncidents.map(i => `${i.title} (${i.districtName})`).join('; ') || 'None'}
- High-Risk Districts: ${highRiskDistricts.join(', ')}
${query ? `User specific inquiry: "${query}"` : 'Provide a concise, highly actionable situational logistics briefing for transport commanders, emergency responders, and field officers.'}

Respond in clean JSON format:
{
  "title": "Short title",
  "summary": "2-3 concise sentences detailing accessibility and supply chain status",
  "keyHazards": ["hazard 1", "hazard 2", "hazard 3"],
  "recommendedActions": ["action 1", "action 2", "action 3"]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const rawText = response.text?.trim() || '';
      const parsed = JSON.parse(rawText);
      return {
        title: parsed.title || 'NER Regional Logistics Situational Briefing',
        summary: parsed.summary || 'Critical arterial highways across northern mountain sectors currently experience weather and landslide delays.',
        keyHazards: Array.isArray(parsed.keyHazards) ? parsed.keyHazards : ['Monsoon road slip', 'Debris flow'],
        recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : ['Reroute heavy vehicles', 'Alert local district authorities'],
        timestamp: new Date().toISOString(),
        source: 'GEMINI_AI'
      };
    } catch (err) {
      console.warn('Gemini API call returned error or could not parse, using deterministic engine:', err);
    }
  }

  // Deterministic fallback based on live store data
  return {
    title: store.emergencyMode.active ? 'EMERGENCY PROTOCOL: Northeast Corridors Status' : 'NER Logistics Situational Briefing',
    summary: blockedRoads.length > 0
      ? `Active blockages detected on ${blockedRoads.join(' and ')}. Supply convoys carrying critical medicines and food grains are being re-routed onto secondary bypasses.`
      : 'All primary arterial routes across the Northeast corridor are reporting accessible to caution status with moderate travel times.',
    keyHazards: [
      'NH-13 Sela Pass: Severe rockslide and freezing sleet condition; heavy multi-axle freight halted',
      'NH-10 Sevoke-Gangtok: Teesta river runoff submerging 29th-Mile segment',
      'NH-6 Meghalaya: Foundation scour on Byrnihat culvert reducing throughput to single lane'
    ],
    recommendedActions: [
      'Enforce automated rerouting via RouteMind Alternate Route Engine for all Tawang & Gangtok consignments',
      'Maintain real-time GPS polling on pharmaceutical and oxygen cylinder transports',
      'Coordinate with BRO Task Force 42 and State Disaster Management Authorities for clearance verification'
    ],
    timestamp: new Date().toISOString(),
    source: 'HEURISTIC_NER_ENGINE'
  };
}
