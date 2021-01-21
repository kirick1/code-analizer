import { Analyzer } from "./analyzer";
import { Input } from "./input";

class Application {
  static SOURCES = ["./test/"];

  static exec(): void {
    const input = new Input(Application.SOURCES);
    const analyzer = new Analyzer(input);

    analyzer.printResult();
  }
}

Application.exec();
