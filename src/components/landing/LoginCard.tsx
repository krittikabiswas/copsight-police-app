import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useHybridTranslation } from "@/hooks/useHybridTranslation";

export const LoginCard = () => {
  const [policeId, setPoliceId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useHybridTranslation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!policeId || !password) {
      toast({
        title: t('login.errorTitle'),
        description: t('login.errorMessage'),
        variant: "destructive",
      });
      return;
    }

    // Simulate login
    toast({
      title: t('login.successTitle'),
      description: t('login.successMessage'),
    });

    navigate("/dashboard");
  };

  return (
    <Card className="w-full max-w-md glass-card border-primary/10 neon-glow">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('login.subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policeId" className="text-foreground">
              {t('login.policeId')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="policeId"
                type="text"
                placeholder={t('login.policeIdPlaceholder')}
                value={policeId}
                onChange={(e) => setPoliceId(e.target.value)}
                className="pl-10 bg-card/50 border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              {t('login.password')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-card/50 border-border"
              />
            </div>
          </div>

          <Button type="submit" className="w-full neon-glow">
            {t('login.loginButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
