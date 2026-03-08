import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../assets/DevShowcaseLogo4.png";
import logoText from "../assets/DevShowcaseLogo4Text.png";
import cyanArrow from "../assets/CyanBackArrow.png";
import greyArrow from "../assets/GreyBackArrow.png";

export default function SignInPage() {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-[rgb(25,25,25)]">
            <div className="my-auto mx-auto max-w-lg w-full p-0">
                <div className="[--radius:var(--radius-4xl)] [--padding:--spacing(1)] bg-[rgb(75,75,75)] rounded-(--radius) p-(--padding)">
                    <div className="flex flex-col h-96 rounded-[calc(var(--radius)-var(--padding))] bg-[rgb(35,35,35)] p-4">
                        <div className="relative w-full h-10">
                            <div className="absolute left-0 top-0">
                                <button type="button" onClick={() => navigate(-1)} className="relative h-10 w-10">
                                    <img src={greyArrow} className="absolute inset-0 h-full w-full object-contain opacity-100 hover:opacity-0 transition-opacity duration-0" />
                                    <img src={cyanArrow} className="absolute inset-0 h-full w-full object-contain opacity-0 hover:opacity-100 transition-opacity duration-0" />
                                </button>
                            </div>
                            <div className="absolute left-1/2 top-0 -translate-x-1/2 flex items-center justify-center">
                                <img src={logo} className="h-10 w-auto" />
                                <img src={logoText} className="h-10 w-auto" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-200 pt-6">Sign In</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}