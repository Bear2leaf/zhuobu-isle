export default function moore(range: number, dimensions: number) {
  range = range || 1
  dimensions = dimensions || 2

  const size = range * 2 + 1
  const length = Math.pow(size, dimensions) - 1
  const neighbors = new Array<number[]>(length)

  for (let i = 0; i < length; i++) {
    const neighbor = neighbors[i] = new Array<number>(dimensions)
    let index = i < length / 2 ? i : i + 1
    for (let dimension = 1; dimension <= dimensions; dimension++) {
      const value = index % Math.pow(size, dimension)
      neighbor[dimension - 1] = value / Math.pow(size, dimension - 1) - range
      index -= value
    }
  }

  return neighbors
}
