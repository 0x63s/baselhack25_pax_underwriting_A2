// Question Types
export const QuestionType = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  RADIO_BUTTON: 'RADIO_BUTTON',
  CHECKBOX: 'CHECKBOX',
  DROPDOWN: 'DROPDOWN',
  TAGS: 'TAGS',
};

// Submission Value Types
export const SubmissionValueType = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
};

// Question Type Labels
export const QuestionTypeLabels = {
  [QuestionType.TEXT]: 'Text Input',
  [QuestionType.NUMBER]: 'Number Input',
  [QuestionType.DATE]: 'Date Picker',
  [QuestionType.RADIO_BUTTON]: 'Radio Button',
  [QuestionType.CHECKBOX]: 'Checkbox',
  [QuestionType.DROPDOWN]: 'Dropdown',
  [QuestionType.TAGS]: 'Tags',
};

// Swiss Cantons
export const SwissCantons = [
  'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR',
  'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG',
  'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
];

// Gender Options
export const GenderOptions = ['MALE', 'FEMALE', 'OTHER'];
