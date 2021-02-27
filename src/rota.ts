export class Document {
  async load() {
    // Simulate wait for loading
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async solve() {
    // Simulate wait for solving
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}
