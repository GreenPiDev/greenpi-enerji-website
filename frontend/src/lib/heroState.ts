// Home sayfasından çıkıp geri dönüldüğünde Hero'nun intro videosunu baştan
// oynatmaması için, kullanıcının loop aşamasına ulaşıp ulaşmadığı burada
// (React state'in dışında, modül seviyesinde) tutuluyor.
let heroExplored = false

export function getHeroExplored(): boolean {
  return heroExplored
}

export function setHeroExplored(value: boolean): void {
  heroExplored = value
}
