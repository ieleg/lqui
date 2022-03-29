export const data = Array.from({length: 10}, (_, k) => ({
  date: '11.2' + k,
  targetValue: (k+1)*(Math.random() + 12112),
  realValue: (k + 2)*(Math.random() + 21111)
}))