export const ACTION_NEEDED = {
  VACCINATE: 'Vaccinate',
  GET_CONSENT: 'Get consent',
  CHECK_REFUSAL: 'Check refusal',
  TRIAGE: 'Triage',
  FOLLOW_UP: 'Triage: follow up',
  NONE: 'No action needed'
}

export const ACTION_TAKEN = {
  VACCINATED: 'Vaccinated',
  DO_NOT_VACCINATE: 'Do not vaccinate',
  COULD_NOT_GET_CONSENT: 'Unable to get consent',
  COULD_NOT_VACCINATE: 'Could not vaccinate',
  REFUSED_CONSENT: 'Refused consent'
}

export const TRIAGE_REASON = {
  HAS_NOTES: 'Notes need triage',
  INCONSISTENT_CONSENT: 'Conflicting consent',
  CHECK_CONSENTER: 'Check parental responsibility'
}

export const TRIAGE = {
  TO_DO: 'To do',
  NEEDS_FOLLOW_UP: 'Needs follow up',
  NO_CONSENT_RESPONSE: 'No response',
  READY: 'Ready for session',
  DO_NOT_VACCINATE: 'Do not vaccinate',
  REFUSED_CONSENT: 'Refused consent'
}

export const CONSENT = {
  GIVEN: 'Given',
  REFUSED: 'Refused',
  UNKNOWN: 'Unknown',
  ONLY_MENACWY: 'Only MenACWY',
  ONLY_3_IN_1: 'Only 3-in-1'
}

export const OUTCOME = {
  NO_OUTCOME_YET: 'No outcome yet',
  VACCINATED: 'Vaccinated',
  NO_CONSENT: 'No consent',
  COULD_NOT_VACCINATE: 'Could not vaccinate'
}

export const MEDICAL = {
  YES: 'Yes',
  NO: 'No medical notes'
}
