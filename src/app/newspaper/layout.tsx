import { ThemePathProvider } from "@/context/ThemePathContext";
import { WelcomePopup } from "@/components/WelcomePopup";
import { Sprinkles } from "@/sprinkles/Sprinkles";
import "./newspaper.css";

export default function NewspaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemePathProvider themePath="newspaper">
      {children}
      <WelcomePopup variant="newspaper" />
      <Sprinkles kind="page-load" />
    </ThemePathProvider>
  );
}
