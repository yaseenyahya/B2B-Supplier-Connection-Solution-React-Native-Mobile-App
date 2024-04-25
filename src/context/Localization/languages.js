export const EN = {
  locale: 'en-US',
  language: 'English',
  code: 'en',
  callingCode: '+92',
  countryCode: 'PK',
  file: require(`../../assets/locales/en-US.json`),
}
export const KO = {
  locale: 'ko_KR',
  language: 'Korean',
  code: 'ko',
  callingCode: '+82',
  countryCode: 'KR',
  file: require(`../../assets/locales/ko_KR.json`),
}
export const VI = {
  locale: 'vi_VN',
  language: 'Vietnamese',
  code: 'vi',
  callingCode: '+84',
  countryCode: 'VN',
  file: require(`../../assets/locales/vi_VN.json`),
}
export const languages = {
  'en-US': EN,
  'ko_KR': KO,
  'vi_VN': VI,
}

export const languageList = Object.values(languages)
