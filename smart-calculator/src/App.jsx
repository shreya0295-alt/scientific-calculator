import { useState } from "react";

function App() {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [isDark, setIsDark] = useState(true);
  const [degreeMode, setDegreeMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // ================================
  // NUMBER
  // ================================
  const handleNumber = (num) => {
    if (display === "Error") {
      setExpression("");
      setDisplay(num);
      return;
    }

    if (display === "0") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  // ================================
  // DECIMAL
  // ================================
  const handleDecimal = () => {
    if (display === "Error") {
      setDisplay("0.");
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // ================================
  // OPERATOR
  // ================================
  const handleOperator = (operator) => {
    if (display === "Error") return;

    if (expression === "") {
      setExpression(display + " " + operator + " ");
    } else {
      setExpression(expression + display + " " + operator + " ");
    }

    setDisplay("0");
  };

  // ================================
  // CLEAR
  // ================================
  const handleClear = () => {
    setExpression("");
    setDisplay("0");
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = () => {
    if (display === "Error" || display.length <= 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // ================================
  // PERCENTAGE
  // ================================
  const handlePercent = () => {
    const value = Number(display);

    if (Number.isNaN(value)) {
      setDisplay("Error");
      return;
    }

    const percentValue = value / 100;

    setDisplay(String(percentValue));
  };

  // ================================
  // BRACKETS
  // ================================
  const handleBracket = (bracket) => {
    if (bracket === "(") {
      if (expression === "" && display === "0") {
        setExpression("(");
      } else {
        setExpression(
          expression + display + " × ("
        );
      }

      setDisplay("0");
    } else {
      setExpression(
        expression + display + " )"
      );

      setDisplay("0");
    }
  };

  // ================================
  // EQUAL
  // ================================
  const handleEquals = () => {
    try {
      let fullExpression = expression + display;

      const calculation = fullExpression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**");

      const result = Function(
        `"use strict"; return (${calculation})`
      )();

      if (!Number.isFinite(result)) {
        throw new Error();
      }

      const resultString = String(result);

      // Add to history
      setHistory((prev) => [
        {
          expression: fullExpression,
          result: resultString,
        },
        ...prev,
      ]);

      setExpression(fullExpression + " =");
      setDisplay(resultString);
    } catch {
      setDisplay("Error");
    }
  };

  // ================================
  // SCIENTIFIC FUNCTIONS
  // ================================
  const handleScientific = (operation) => {
    const value = Number(display);

    if (Number.isNaN(value)) {
      setDisplay("Error");
      return;
    }

    let result;

    switch (operation) {
      // SIN
      case "sin":
        result = degreeMode
          ? Math.sin((value * Math.PI) / 180)
          : Math.sin(value);
        break;

      // COS
      case "cos":
        result = degreeMode
          ? Math.cos((value * Math.PI) / 180)
          : Math.cos(value);
        break;

      // TAN
      case "tan":
        result = degreeMode
          ? Math.tan((value * Math.PI) / 180)
          : Math.tan(value);
        break;

      // SQUARE ROOT
      case "√":
        result = Math.sqrt(value);
        break;

      // SQUARE
      case "x²":
        result = value ** 2;
        break;

      // CUBE
      case "x³":
        result = value ** 3;
        break;

      // POWER
      case "xʸ":
        setExpression(`${display} ^ `);
        setDisplay("0");
        return;

      // LOG
      case "log":
        result = Math.log10(value);
        break;

      // NATURAL LOG
      case "ln":
        result = Math.log(value);
        break;

      // RECIPROCAL
      case "1/x":
        result = 1 / value;
        break;

      // PI
      case "π":
        result = Math.PI;
        break;

      // EULER
      case "e":
        result = Math.E;
        break;

      // FACTORIAL
      case "x!":
        if (
          value < 0 ||
          !Number.isInteger(value)
        ) {
          setDisplay("Error");
          return;
        }

        result = 1;

        for (let i = 2; i <= value; i++) {
          result *= i;
        }
        break;

      default:
        result = value;
    }

    if (!Number.isFinite(result)) {
      setDisplay("Error");
      return;
    }

    setExpression(
      `${operation}(${display})`
    );

    setDisplay(String(result));
  };

  // ================================
  // HISTORY
  // ================================
  const clearHistory = () => {
    setHistory([]);
  };

  // ================================
  // LOAD HISTORY RESULT
  // ================================
  const loadHistory = (result) => {
    setDisplay(result);
    setExpression("");
  };

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-center p-4 transition-colors duration-300 ${
        isDark
          ? "bg-[#050505]"
          : "bg-[#d8d2d0]"
      }`}
    >

      {/* CALCULATOR */}

      <div
        className={`w-full max-w-[460px] rounded-[32px] p-5 sm:p-6 shadow-2xl transition-all ${
          isDark
            ? "calculator-dark bg-[#111111]"
            : "calculator-light bg-[#fffaf7]"
        }`}
      >

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between mb-6 gap-3">

          <h1
            className={`text-2xl sm:text-3xl font-semibold ${
              isDark
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            Scientific Calculator
          </h1>

          <div className="flex gap-2 shrink-0">

            {/* HISTORY */}

            <button
              onClick={() =>
                setShowHistory(!showHistory)
              }
              className="w-11 h-11 rounded-full bg-slate-800 text-white text-lg hover:bg-slate-700 active:scale-90 transition"
              title="History"
            >
              🕘
            </button>

            {/* DARK MODE */}

            <button
              onClick={() =>
                setIsDark(!isDark)
              }
              className="w-11 h-11 rounded-full bg-slate-800 text-lg hover:bg-slate-700 active:scale-90 transition"
              title="Dark / Light Mode"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

          </div>
        </div>


        {/* ================= DISPLAY ================= */}

        <div className="h-[170px] flex flex-col justify-end px-4 pb-5 mb-5">

          <div
            className={`text-right text-lg min-h-7 break-all ${
              isDark
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            {expression}
          </div>

          <div
            className={`text-right text-5xl sm:text-6xl font-light mt-2 break-all ${
              isDark
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            {display}
          </div>

        </div>


        {/* ================= DEG / RAD ================= */}

        <div className="flex justify-between items-center mb-4">

          <button
            onClick={() =>
              setDegreeMode(!degreeMode)
            }
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              degreeMode
                ? "bg-orange-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {degreeMode ? "DEG" : "RAD"}
          </button>

          <span
            className={`text-sm ${
              isDark
                ? "text-slate-500"
                : "text-slate-600"
            }`}
          >
            {degreeMode
              ? "Degrees"
              : "Radians"}
          </span>

        </div>


        {/* ================= SCIENTIFIC ================= */}

        <div className="grid grid-cols-5 gap-3 mb-3">

          <button className="calc-scientific">
            2nd
          </button>

          <button
            onClick={() =>
              setDegreeMode(!degreeMode)
            }
            className="calc-scientific"
          >
            {degreeMode ? "deg" : "rad"}
          </button>

          <button
            onClick={() =>
              handleScientific("sin")
            }
            className="calc-scientific"
          >
            sin
          </button>

          <button
            onClick={() =>
              handleScientific("cos")
            }
            className="calc-scientific"
          >
            cos
          </button>

          <button
            onClick={() =>
              handleScientific("tan")
            }
            className="calc-scientific"
          >
            tan
          </button>


          <button
            onClick={() =>
              handleScientific("xʸ")
            }
            className="calc-scientific"
          >
            xʸ
          </button>

          <button
            onClick={() =>
              handleScientific("log")
            }
            className="calc-scientific"
          >
            log
          </button>

          <button
            onClick={() =>
              handleScientific("ln")
            }
            className="calc-scientific"
          >
            ln
          </button>

          <button
            onClick={() =>
              handleBracket("(")
            }
            className="calc-scientific"
          >
            (
          </button>

          <button
            onClick={() =>
              handleBracket(")")
            }
            className="calc-scientific"
          >
            )
          </button>

        </div>


        {/* ================= MAIN BUTTONS ================= */}

        <div className="grid grid-cols-5 gap-3">

          {/* ROW 3 */}

          <button
            onClick={() =>
              handleScientific("√")
            }
            className="calc-scientific"
          >
            √x
          </button>

          <button
            onClick={handleClear}
            className="calc-orange"
          >
            AC
          </button>

          <button
            onClick={handleDelete}
            className="calc-orange"
          >
            ⌫
          </button>

          <button
            onClick={handlePercent}
            className="calc-orange"
          >
            %
          </button>

          <button
            onClick={() =>
              handleOperator("÷")
            }
            className="calc-orange"
          >
            ÷
          </button>


          {/* ROW 4 */}

          <button
            onClick={() =>
              handleScientific("x!")
            }
            className="calc-scientific"
          >
            x!
          </button>

          <button
            onClick={() =>
              handleNumber("7")
            }
            className="calc-number"
          >
            7
          </button>

          <button
            onClick={() =>
              handleNumber("8")
            }
            className="calc-number"
          >
            8
          </button>

          <button
            onClick={() =>
              handleNumber("9")
            }
            className="calc-number"
          >
            9
          </button>

          <button
            onClick={() =>
              handleOperator("×")
            }
            className="calc-orange"
          >
            ×
          </button>


          {/* ROW 5 */}

          <button
            onClick={() =>
              handleScientific("1/x")
            }
            className="calc-scientific"
          >
            1/x
          </button>

          <button
            onClick={() =>
              handleNumber("4")
            }
            className="calc-number"
          >
            4
          </button>

          <button
            onClick={() =>
              handleNumber("5")
            }
            className="calc-number"
          >
            5
          </button>

          <button
            onClick={() =>
              handleNumber("6")
            }
            className="calc-number"
          >
            6
          </button>

          <button
            onClick={() =>
              handleOperator("-")
            }
            className="calc-orange"
          >
            −
          </button>


          {/* ROW 6 */}

          <button
            onClick={() =>
              handleScientific("π")
            }
            className="calc-scientific"
          >
            π
          </button>

          <button
            onClick={() =>
              handleNumber("1")
            }
            className="calc-number"
          >
            1
          </button>

          <button
            onClick={() =>
              handleNumber("2")
            }
            className="calc-number"
          >
            2
          </button>

          <button
            onClick={() =>
              handleNumber("3")
            }
            className="calc-number"
          >
            3
          </button>

          <button
            onClick={() =>
              handleOperator("+")
            }
            className="calc-orange"
          >
            +
          </button>


          {/* ROW 7 */}

          <button
            onClick={() =>
              handleScientific("e")
            }
            className="calc-scientific"
          >
            e
          </button>

          <button
            onClick={() =>
              handleNumber("0")
            }
            className="calc-number"
          >
            0
          </button>

          <button
            onClick={handleDecimal}
            className="calc-number"
          >
            .
          </button>

          <button
            onClick={() =>
              handleScientific("x²")
            }
            className="calc-scientific"
          >
            x²
          </button>

          <button
            onClick={handleEquals}
            className="calc-equal"
          >
            =
          </button>

        </div>


        {/* ================= HISTORY ================= */}

        {showHistory && (
          <div
            className={`mt-5 rounded-2xl p-4 ${
              isDark
                ? "bg-[#1c1c1c]"
                : "bg-white"
            }`}
          >

            <div className="flex justify-between items-center mb-3">

              <h2
                className={`font-semibold text-lg ${
                  isDark
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                Calculation History
              </h2>

              <button
                onClick={clearHistory}
                className="text-orange-400 text-sm hover:text-orange-300"
              >
                Clear
              </button>

            </div>


            {history.length === 0 ? (

              <p
                className={`text-center py-4 ${
                  isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                No calculations yet
              </p>

            ) : (

              <div className="max-h-52 overflow-y-auto space-y-3">

                {history.map((item, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      loadHistory(item.result)
                    }
                    className={`w-full text-left border-b pb-2 transition ${
                      isDark
                        ? "border-slate-700 hover:bg-slate-800"
                        : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >

                    <p
                      className={`text-sm break-all ${
                        isDark
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {item.expression}
                    </p>

                    <p
                      className={`text-lg ${
                        isDark
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      = {item.result}
                    </p>

                  </button>

                ))}

              </div>

            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default App;