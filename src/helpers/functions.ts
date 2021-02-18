export const throttle = <T extends []>(
  callback: (...args: T) => void,
  timer: number
) => {
  let currentTimer: NodeJS.Timer | null = null
  return (...args: T) => {
    if (currentTimer) {
      return
    }

    currentTimer = setTimeout(() => {
      currentTimer = null
      callback(...args)
    }, timer)
  }
}
