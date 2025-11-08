import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { languages, coreLanguages, extendedLanguages } from "@/i18n/languages";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LanguageSelector() {
    const { i18n } = useTranslation();

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        const selectedLang = languages.find(l => l.code === langCode);
        console.log(`🔄 [Language Switch] ${selectedLang?.nativeName} (${langCode})`);
        i18n.changeLanguage(langCode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-border/50 hover:border-primary/50 transition-colors"
                >
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card min-w-[220px]">
                <ScrollArea className="h-[400px]">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Core Languages (Full Support)
                    </DropdownMenuLabel>
                    {coreLanguages.map((language) => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => changeLanguage(language.code)}
                            className={`cursor-pointer ${
                                currentLanguage.code === language.code ? "bg-primary/10" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{language.flag}</span>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{language.nativeName}</span>
                                        <span className="text-xs text-muted-foreground">{language.name}</span>
                                    </div>
                                </div>
                                {currentLanguage.code === language.code && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Additional Languages (AI-Powered)
                    </DropdownMenuLabel>
                    {extendedLanguages.map((language) => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => changeLanguage(language.code)}
                            className={`cursor-pointer ${
                                currentLanguage.code === language.code ? "bg-primary/10" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{language.flag}</span>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{language.nativeName}</span>
                                        <span className="text-xs text-muted-foreground">{language.name}</span>
                                    </div>
                                </div>
                                {currentLanguage.code === language.code && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
