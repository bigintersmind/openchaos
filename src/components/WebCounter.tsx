"use client";

export function WebCounter() {
  const count = 1337;

  // Format leading zeros
  const formattedCount = count.toString().padStart(6, "0");

  // Split for each "cell"
  const digits = formattedCount.split("");

  return (
    <div className="webcounter-container">
      <div className="webcounter-box">
        <div className="webcounter-header">
          <span className="webcounter-header-text">
            You are visitor number
          </span>
        </div>
        <div className="webcounter-digits">
          {digits.map((digit, index) => (
            <div key={index} className="webcounter-digit">
              {digit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
