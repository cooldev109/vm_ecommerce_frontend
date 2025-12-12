import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  FileText,
  Shield,
  Flame,
  Droplets,
  Clock,
  Leaf,
  AlertTriangle,
  Phone,
  Recycle,
  Heart,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductDocumentation() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('back')}
      </Button>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('productDocumentation')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('productDocumentationDesc')}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('technicalSheet')}
          </TabsTrigger>
          <TabsTrigger value="safety" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('safetyDataSheet')}
          </TabsTrigger>
        </TabsList>

        {/* Technical Data Sheet */}
        <TabsContent value="technical">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl">{t('technicalDataSheet')}</CardTitle>
                  <CardDescription>V&M Candle Experience</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {t('issuedDate')}: 2025
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Product Identification */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  {t('productIdentification')}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t('productName')}</p>
                    <p className="font-medium">Calm Ritual – Línea Signature Luxury</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t('brand')}</p>
                    <p className="font-medium">V&M Candle Experience</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg md:col-span-2">
                    <p className="text-sm text-muted-foreground">{t('productType')}</p>
                    <p className="font-medium">{language === 'es' ? 'Vela aromática de alta perfumería – Uso decorativo, sensorial y terapéutico' : 'High perfumery aromatic candle – Decorative, sensory and therapeutic use'}</p>
                  </div>
                </div>
              </section>

              {/* Composition */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  {t('composition')}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Droplets className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm text-muted-foreground">{t('naturalSoyWax')}</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">200g</p>
                    <p className="text-sm text-muted-foreground">{t('waxAmount')}</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">25ml</p>
                    <p className="text-sm text-muted-foreground">{t('essentialOil')}</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">~223g</p>
                    <p className="text-sm text-muted-foreground">{t('totalWeight')}</p>
                  </div>
                </div>
              </section>

              {/* Aromatic Load */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  {t('aromaticLoad')}
                </h3>
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-3xl font-bold text-amber-600">10.3%</p>
                      <p className="text-sm text-muted-foreground">{t('concentrationPercentage')}</p>
                    </div>
                    <Badge className="bg-amber-500 text-white">
                      {t('highPerfumery')}
                    </Badge>
                  </div>
                </div>
              </section>

              {/* Curing Time */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  {t('curingTime')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-semibold">{t('minimumRecommended')}</p>
                    <p className="text-2xl font-bold text-primary">14 {t('days')}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <p className="font-semibold">{t('optimalLuxury')}</p>
                    <p className="text-2xl font-bold text-primary">21 {t('days')}</p>
                  </div>
                </div>
              </section>

              {/* Wick Type */}
              <section>
                <h3 className="text-lg font-semibold mb-4">{t('wickType')}</h3>
                <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>{t('cottonWick')}</span>
                </div>
              </section>

              {/* Usage Instructions */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  {t('usageInstructions')}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</span>
                    <p>{t('usageStep1')}</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</span>
                    <p>{t('usageStep2')}</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</span>
                    <p>{t('usageStep3')}</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/30">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p>{t('keepAwayFromChildren')}</p>
                  </div>
                </div>
              </section>

              {/* Safety Warnings */}
              <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  {t('safetyWarnings')}
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500 mb-2" />
                    <p className="text-sm">{t('noFlammableMaterials')}</p>
                  </div>
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500 mb-2" />
                    <p className="text-sm">{t('noMoveWhileLit')}</p>
                  </div>
                  <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500 mb-2" />
                    <p className="text-sm">{t('keepDistance')}</p>
                  </div>
                </div>
              </section>

              {/* Classification */}
              <section className="p-6 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{t('productClassification')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('classificationDesc')} <strong>{t('notMedicine')}</strong>
                </p>
                <h3 className="text-lg font-semibold mb-3">{t('manufacturing')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('manufacturingDesc')}
                </p>
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">
                    {t('signatureLuxuryNote')}
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Data Sheet (MSDS) */}
        <TabsContent value="safety">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl">{t('safetyDataSheet')}</CardTitle>
                  <CardDescription>{t('safetyDataSheetSubtitle')}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {language === 'es' ? 'Diciembre 2025 – Chile' : 'December 2025 – Chile'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Section 1 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">1. {t('productIdentification').toUpperCase()}</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">{language === 'es' ? 'Nombre' : 'Name'}:</span> Calm Ritual</div>
                  <div><span className="text-muted-foreground">{language === 'es' ? 'Uso' : 'Use'}:</span> {language === 'es' ? 'Ambientación y decoración' : 'Ambiance and decoration'}</div>
                  <div><span className="text-muted-foreground">{language === 'es' ? 'Proveedor' : 'Supplier'}:</span> V&M Candle Experience</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{t('emergencyPhone')}:</span> +56 992257712
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  2. {t('hazardIdentification').toUpperCase()}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Flame className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    {t('flammableProduct')}
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {t('burnRisk')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {t('nonToxicNormal')}
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">3. {t('compositionInfo').toUpperCase()}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Leaf className="h-3 w-3 mr-1" />
                    {t('vegetableSoyWax')}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {t('naturalFragrances')}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {t('leadFreeCottonWick')}
                  </Badge>
                </div>
              </section>

              {/* Section 4 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">4. {t('firstAid').toUpperCase()}</h3>
                <p className="text-sm">
                  <strong>{t('skinContact')}</strong> {t('coolWithWater')}
                </p>
              </section>

              {/* Section 5 */}
              <section className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3">5. {t('fireFighting').toUpperCase()}</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {t('useClassBExtinguisher')}
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {t('neverUseWater')}
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">6. {t('spillMeasures').toUpperCase()}</h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t('letSolidify')}</li>
                  <li>• {t('avoidBurns')}</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">7. {t('handlingStorage').toUpperCase()}</h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t('keepFromHeat')}</li>
                  <li>• {t('storeCoolDry')}</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">8. {t('exposureControl').toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">{t('noSpecialProtection')}</p>
              </section>

              {/* Section 9 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">9. {t('physicalProperties').toUpperCase()}</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div><span className="text-muted-foreground">{t('state')}:</span> {t('solid')}</div>
                  <div><span className="text-muted-foreground">{t('color')}:</span> {t('variable')}</div>
                  <div><span className="text-muted-foreground">{t('smell')}:</span> {t('aromatic')}</div>
                </div>
              </section>

              {/* Section 10 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">10. {t('stabilityReactivity').toUpperCase()}</h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t('stableProduct')}</li>
                  <li>• {t('avoidDirectFire')}</li>
                </ul>
              </section>

              {/* Section 11 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">11. {t('toxicologicalInfo').toUpperCase()}</h3>
                <div className="flex gap-4">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {t('nonToxic')}
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    {t('doNotIngest')}
                  </Badge>
                </div>
              </section>

              {/* Section 12 */}
              <section className="p-4 border border-green-200 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                  <Recycle className="h-5 w-5" />
                  12. {t('ecologicalInfo').toUpperCase()}
                </h3>
                <div className="flex gap-4">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    <Leaf className="h-3 w-3 mr-1" />
                    {t('biodegradable')}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    <Recycle className="h-3 w-3 mr-1" />
                    {t('recyclablePackaging')}
                  </Badge>
                </div>
              </section>

              {/* Section 13 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">13. {t('disposalInfo').toUpperCase()}</h3>
                <ul className="space-y-1 text-sm">
                  <li>• {t('disposeLocally')}</li>
                  <li>• {t('noDrainDisposal')}</li>
                </ul>
              </section>

              {/* Section 14 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">14. {t('transportInfo').toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('notDangerous')}
                </p>
              </section>

              {/* Section 15 */}
              <section className="p-4 border rounded-lg">
                <h3 className="font-semibold text-primary mb-3">15. {t('regulatoryInfo').toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('chileanCompliance')}
                </p>
              </section>

              {/* Section 16 */}
              <section className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-3">16. {t('otherInfo').toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('infoDisclaimer')}
                </p>
              </section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>{language === 'es' ? 'Elaborado por V&M Candle Experience • Chile' : 'Prepared by V&M Candle Experience • Chile'}</p>
        <p className="mt-1">
          {t('contactQuestions')}{' '}
          <a href="mailto:vymcandlexperience@gmail.com" className="text-primary hover:underline">
            vymcandlexperience@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
