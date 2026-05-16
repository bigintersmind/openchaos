import { CursorTrail } from "@/components/CursorTrail";
import { ThemePathProvider } from "@/context/ThemePathContext";
import { Sprinkles } from "@/sprinkles/Sprinkles";
import { WelcomePopup } from "@/components/WelcomePopup";
import "./vaporwave.css";

export default function VaporwaveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemePathProvider themePath="vaporwave">
      <div className="vw-container">
        {children}
        <CursorTrail />
        <Sprinkles kind="page-load" />
        <WelcomePopup variant="vaporwave" />
      </div>
    </ThemePathProvider>
  );
}
