from typing import Dict, Optional

# Latitude and longitude reference points for Odisha districts used by the datasets.
# Coordinates target the district headquarters for accurate GIS overlays.
_DISTRICT_GEO_REGISTRY: Dict[str, Dict[str, float | str]] = {
    "angul": {"lat": 20.8390, "lng": 85.0970, "state": "Odisha"},
    "balangir": {"lat": 20.7043, "lng": 83.4843, "state": "Odisha"},
    "balasore": {"lat": 21.4942, "lng": 86.9330, "state": "Odisha"},
    "bargarh": {"lat": 21.3420, "lng": 83.6190, "state": "Odisha"},
    "bhadrak": {"lat": 21.0574, "lng": 86.5155, "state": "Odisha"},
    "bhubaneswar": {"lat": 20.2961, "lng": 85.8245, "state": "Odisha"},
    "boudh": {"lat": 20.8373, "lng": 84.3275, "state": "Odisha"},
    "cuttack": {"lat": 20.4625, "lng": 85.8828, "state": "Odisha"},
    "deogarh": {"lat": 21.5389, "lng": 84.7289, "state": "Odisha"},
    "dhenkanal": {"lat": 20.6574, "lng": 85.5969, "state": "Odisha"},
    "gajapati": {"lat": 18.7808, "lng": 84.0886, "state": "Odisha"},
    "ganjam": {"lat": 19.3897, "lng": 85.0600, "state": "Odisha"},
    "jagatsinghpur": {"lat": 20.2588, "lng": 86.1711, "state": "Odisha"},
    "jajpur": {"lat": 20.8400, "lng": 86.3373, "state": "Odisha"},
    "jharsuguda": {"lat": 21.8687, "lng": 84.0067, "state": "Odisha"},
    "kalahandi": {"lat": 19.9136, "lng": 83.1649, "state": "Odisha"},
    "kandhamal": {"lat": 20.4670, "lng": 84.2335, "state": "Odisha"},
    "kendrapara": {"lat": 20.5006, "lng": 86.4160, "state": "Odisha"},
    "kendujhar": {"lat": 21.6284, "lng": 85.6002, "state": "Odisha"},
    "khordha": {"lat": 20.1822, "lng": 85.6160, "state": "Odisha"},
    "koraput": {"lat": 18.8110, "lng": 82.7123, "state": "Odisha"},
    "malkangiri": {"lat": 18.3537, "lng": 81.8893, "state": "Odisha"},
    "mayurbhanj": {"lat": 21.9385, "lng": 86.7387, "state": "Odisha"},
    "nabarangpur": {"lat": 19.2311, "lng": 82.5479, "state": "Odisha"},
    "nayagarh": {"lat": 20.1288, "lng": 85.0985, "state": "Odisha"},
    "nuapada": {"lat": 20.8080, "lng": 82.5330, "state": "Odisha"},
    "puri": {"lat": 19.8135, "lng": 85.8312, "state": "Odisha"},
    "rayagada": {"lat": 19.1710, "lng": 83.4163, "state": "Odisha"},
    "sambalpur": {"lat": 21.4669, "lng": 83.9812, "state": "Odisha"},
    "subarnapur": {"lat": 20.8330, "lng": 83.9169, "state": "Odisha"},
    "rourkela": {"lat": 22.2604, "lng": 84.8536, "state": "Odisha"},
    "sundargarh": {"lat": 22.2604, "lng": 84.8536, "state": "Odisha"},
}

# Common alternate spellings that may appear in different datasets.
_DISTRICT_ALIASES = {
    "angul": {"anugul"},
    "balangir": {"bolangir"},
    "balasore": {"baleshwar", "balaswar"},
    "bargarh": {"padampur"},
    "bhadrak": {"bhadrak town"},
    "bhubaneswar": {"bhubaneshwar"},
    "boudh": {"baudh"},
    "cuttack": {"katak"},
    "deogarh": {"debagarh"},
    "dhenkanal": {"dhenkanal town"},
    "gajapati": {"paralakhemundi"},
    "ganjam": {"chhatrapur"},
    "jagatsinghpur": {"jagatsingpur"},
    "jajpur": {"jaipur"},
    "jharsuguda": {"jharsugura"},
    "kalahandi": {"bhawanipatna"},
    "kandhamal": {"phulbani"},
    "kendrapara": {"kendrapada"},
    "kendujhar": {"keonjhar"},
    "khordha": {"khurda", "khorda"},
    "koraput": {"jeypore"},
    "malkangiri": {"malakangiri"},
    "mayurbhanj": {"baripada"},
    "nabarangpur": {"navarangpur"},
    "nayagarh": {"nayagad"},
    "nuapada": {"nuapara"},
    "rayagada": {"raigada"},
    "subarnapur": {"sonepur"},
    "sundargarh": {"sundargar"},
}

# Extend registry with aliases for quick lookups.
for canonical, aliases in _DISTRICT_ALIASES.items():
    for alias in aliases:
        _DISTRICT_GEO_REGISTRY.setdefault(alias, _DISTRICT_GEO_REGISTRY[canonical])


def _normalise_key(name: str) -> str:
    return name.strip().lower().replace(" ", "")


def get_geo_location(district_name: str) -> Optional[Dict[str, float | str]]:
    """Return geospatial metadata for a district if available."""
    if not district_name:
        return None

    normalized = _normalise_key(district_name)
    direct_match = _DISTRICT_GEO_REGISTRY.get(normalized)
    if direct_match:
        return direct_match

    # Try without removing spaces for names already stored with spaces.
    spaced_match = _DISTRICT_GEO_REGISTRY.get(district_name.strip().lower())
    if spaced_match:
        return spaced_match

    return None
