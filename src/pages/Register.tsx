import { useState } from "react";
import registerBg from "@/assets/register-bg.jpg";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import { useHybridTranslation } from "@/hooks/useHybridTranslation";

const RANKS = [
  "Constable",
  "ASI",
  "SI",
  "Inspector",
  "ACP",
  "DCP",
  "SP",
];

const VALID_POLICE_IDS = [
  // Odisha (10)
  "OD-BBSR-1001", "OD-CTC-1002", "OD-PURI-1003", "OD-KHDR-1004", "OD-BRMP-1005",
  "OD-SMBP-1006", "OD-RKL-1007", "OD-BLSR-1008", "OD-ANGL-1009", "OD-KNDP-1010",

  // Across India (30)
  "MH-MUM-2001", "MH-PUNE-2002", "MH-NGP-2003", "GJ-AHMD-2004", "GJ-SRT-2005",
  "RJ-JPR-2006", "UP-LKO-2007", "UP-VNS-2008", "BR-PTN-2009", "JH-RNC-2010",
  "WB-KOL-2011", "DL-NDLS-2012", "CH-CHD-2013", "PB-AMR-2014", "HP-SML-2015",
  "UK-DDN-2016", "AS-GHY-2017", "ML-SHL-2018", "TN-CHN-2019", "KA-BLR-2020",
  "TS-HYD-2021", "AP-VSP-2022", "KL-TVM-2023", "GA-PNJ-2024", "PY-PDY-2025",
  "LA-LEH-2026", "JK-SGR-2027", "MN-IMP-2028", "TR-AGT-2029", "WB-DRJ-2030"
];


const DISTRICTS = [
  // Odisha (10)
  "Bhubaneswar", "Cuttack", "Puri", "Khordha", "Berhampur", "Sambalpur", "Rourkela", "Balasore", "Angul", "Kendrapara",

  // Across India (30)
  "Mumbai", "Pune", "Nagpur", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Varanasi", "Patna", "Ranchi",
  "Kolkata", "New Delhi", "Chandigarh", "Amritsar", "Shimla", "Dehradun", "Guwahati", "Shillong", "Chennai", "Bengaluru",
  "Hyderabad", "Visakhapatnam", "Thiruvananthapuram", "Panaji", "Pondicherry", "Leh", "Srinagar", "Imphal", "Agartala", "Darjeeling"
];


interface FormData {
  fullName: string;
  policeId: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  rank: string;
  district: string;
  termsAccepted: boolean;
}

const Register = () => {
  const { toast } = useToast();
  const { t } = useHybridTranslation();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    policeId: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    rank: "",
    district: "",
    termsAccepted: false,
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update password strength when password changes
    if (field === "password") {
      const strength = calculatePasswordStrength(value as string);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 25) return "bg-destructive";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const verifyPoliceId = async () => {
    setIsVerifying(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Check against dummy ID list
      const verified = VALID_POLICE_IDS.includes(formData.policeId.trim().toUpperCase());

      setIsVerified(verified);
      toast({
        title: verified ? t('register.idVerified') : t('register.verificationFailed'),
        description: verified
          ? t('register.idVerifiedDesc')
          : t('register.verificationFailedDesc'),
        variant: verified ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: t('register.verificationError'),
        description: t('register.verificationErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      toast({
        title: t('register.verificationRequired'),
        description: t('register.verificationRequiredDesc'),
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t('register.passwordMismatch'),
        description: t('register.passwordMismatchDesc'),
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.endsWith("@statepolice.gov")) {
      toast({
        title: t('register.invalidEmail'),
        description: t('register.invalidEmailDesc'),
        variant: "destructive",
      });
      return;
    }

    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      toast({
        title: t('register.invalidMobile'),
        description: t('register.invalidMobileDesc'),
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 75) {
      toast({
        title: t('register.weakPassword'),
        description: t('register.weakPasswordDesc'),
        variant: "destructive",
      });
      return;
    }

    if (!formData.termsAccepted) {
      toast({
        title: t('register.termsNotAccepted'),
        description: t('register.termsNotAcceptedDesc'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: t('register.registrationFailed'),
        description: t('register.registrationFailedDesc'),
        variant: "destructive",
      });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
      }}
    >
      {/* lighten background slightly to reduce contrast and make card pop */}
      <div className="absolute inset-0 bg-white/30 mix-blend-overlay" aria-hidden />

      <div className="relative container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto glass-card border-primary/20 shadow-xl bg-white/90 text-black">

          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-blue-700">
              {t('register.title')}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base mt-2">
              {t('register.subtitle')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">{t('register.fullName')}</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="bg-white/100 text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="policeId">{t('register.policeId')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="policeId"
                      required
                      value={formData.policeId}
                      onChange={(e) => {
                        handleInputChange("policeId", e.target.value);
                        setIsVerified(false);
                      }}
                      className="bg-white/100 text-black border-gray-300"
                    />
                    <Button
                      type="button"
                      onClick={verifyPoliceId}
                      disabled={isVerifying || !formData.policeId}
                      className="min-w-[100px]"
                    >
                      {isVerifying ? t('register.verifying') : t('register.verify')}
                    </Button>
                  </div>
                  {formData.policeId && !isVerifying && (
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">{t('register.verified')}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-destructive">Not Verified</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t('register.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="officer@statepolice.gov"
                    className="bg-white/100 text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">{t('register.mobile')}</Label>
                  <Input
                    id="mobile"
                    required
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    maxLength={10}
                    placeholder={t('register.mobileHelper')}
                    className="bg-white/100 text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t('register.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-white/100 text-black border-gray-300"
                  />
                  <div className="mt-2">
                    <Progress value={passwordStrength} className={getStrengthColor(passwordStrength)} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {passwordStrength <= 25 && t('register.weak')}
                      {passwordStrength > 25 && passwordStrength <= 50 && t('register.medium')}
                      {passwordStrength > 50 && passwordStrength <= 75 && t('register.strong')}
                      {passwordStrength > 75 && t('register.strong')}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-white/100 text-black border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="rank">{t('register.rank')}</Label>
                  <Select
                    value={formData.rank}
                    onValueChange={(value) => handleInputChange("rank", value)}
                  >
                    <SelectTrigger className="bg-white/100 text-black border-gray-300">
                      <SelectValue placeholder={t('register.selectRank')} />
                    </SelectTrigger>
                    <SelectContent>
                      {RANKS.map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="district">{t('register.district')}</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => handleInputChange("district", value)}
                  >
                    <SelectTrigger className="bg-white/100 text-black border-gray-300">
                      <SelectValue placeholder={t('register.selectDistrict')} />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      handleInputChange("termsAccepted", checked === true)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-orange-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that I am an authorized police personnel
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {t('register.registerButton')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('register.successTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('register.successMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => window.location.href = "/"}>
                {t('register.successButton')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
};

export default Register;