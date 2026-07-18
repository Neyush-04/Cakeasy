import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Cake,
  Calendar,
  FileText,
  CheckCircle2,
  Palette,
  Layers,
  ImagePlus,
  Ruler,
  Flower2
} from 'lucide-react';
import { POPULAR_FLAVORS } from '../data';
import { CustomCakeState, AtelierSettings } from '../types';

interface CustomBuilderViewProps {
  onAddCustomInquiry: (cake: CustomCakeState, date: string, notes: string) => void;
  settings: AtelierSettings;
}

export default function CustomBuilderView({ onAddCustomInquiry, settings }: CustomBuilderViewProps) {
  const [step, setStep] = useState(1);
  const [tiers, setTiers] = useState<1 | 2 | 3>(1);
  const [shape, setShape] = useState<'round' | 'square' | 'heart'>('round');
  const [weight, setWeight] = useState<string>('1kg');
  const [flavor, setFlavor] = useState<string>('Classic Madagascar Vanilla');
  const [frostingStyle, setFrostingStyle] = useState<'smooth' | 'rustic' | 'textured'>('smooth');
  const [frostingColor, setFrostingColor] = useState<string>('#F6B8C8'); // Pastel Pink default
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studioVisible, setStudioVisible] = useState(false);
  const studioRef = useRef<HTMLDivElement | null>(null);
  
  const frostingColors = [
    { name: 'Rose Blush', hex: '#F6B8C8' },
    { name: 'Lavender Mist', hex: '#E2D4F0' },
    { name: 'White Vanilla', hex: '#FFFDF9' },
    { name: 'Mint Dream', hex: '#D1EAE0' },
    { name: 'Lemon Custard', hex: '#FFF2C2' },
    { name: 'Berry Velvet', hex: '#D63384' },
  ];

  const toppingsOptions = [
    { id: 'rose', name: 'Cascading Organic Roses', price: '₹400' },
    { id: 'gold', name: 'Edible Gold Leaf', price: '₹300' },
    { id: 'macaron', name: 'French Macarons', price: '₹250' },
    { id: 'drip', name: 'White Chocolate Drip', price: '₹150' },
    { id: 'berry', name: 'Fresh Seasonal Berries', price: '₹350' },
    { id: 'sprinkles', name: 'Vintage Sugar Pearls', price: '₹100' },
  ];

  const stepCards = [
    { step: 1, title: 'Structure', eyebrow: 'Shape, tier, weight', icon: Layers },
    { step: 2, title: 'Flavour', eyebrow: 'Sponge + frosting', icon: Cake },
    { step: 3, title: 'Palette', eyebrow: 'Colour + message', icon: Palette },
    { step: 4, title: 'Garnish', eyebrow: 'Florals, gold, drip', icon: Flower2 },
    { step: 5, title: 'Brief', eyebrow: 'Reference + date', icon: ImagePlus },
  ];

  const selectedFrostingName = frostingColors.find(color => color.hex === frostingColor)?.name || 'Custom shade';
  const selectedToppingNames = selectedToppings.map(t => toppingsOptions.find(opt => opt.id === t)?.name || t);
  const activeStepCard = stepCards[step - 1];
  const ActiveStepIcon = activeStepCard.icon;

  const plateWidth = useMemo(() => {
    if (weight === '0.5kg') return 'w-48';
    if (weight === '2kg') return 'w-64';
    if (weight === '3kg') return 'w-72';
    if (weight === '5kg+') return 'w-80';
    return 'w-56';
  }, [weight]);

  useEffect(() => {
    const target = studioRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStudioVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleToppingToggle = (id: string) => {
    setSelectedToppings(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const goToStep = (nextStep: number) => {
    setStep(Math.min(5, Math.max(1, nextStep)));
    window.requestAnimationFrame(() => {
      document.getElementById('cakeasy-builder-workspace')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  };

  const calculateEstPrice = () => {
    let base = settings.base1Tier || 999;
    if (tiers === 2) base = settings.base2Tiers || 2499;
    if (tiers === 3) base = settings.base3Tiers || 4999;

    // Weight multiplication factor (roughly)
    let weightFactor = 1;
    if (weight === '2kg') weightFactor = 1.8;
    if (weight === '3kg') weightFactor = 2.6;
    if (weight === '5kg+') weightFactor = 4.2;

    let toppingsCost = selectedToppings.length * 200;

    return Math.round(base * weightFactor + toppingsCost);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteInquiry = () => {
    const customCake: CustomCakeState = {
      tiers,
      shape,
      flavor,
      frostingColor,
      frostingStyle,
      toppings: selectedToppings.map(t => toppingsOptions.find(opt => opt.id === t)?.name || t),
      message: cakeMessage,
      referenceImageName: uploadedImageName || undefined,
      referenceAttached: Boolean(uploadedImage),
    };
    onAddCustomInquiry(customCake, deliveryDate, specialInstructions);
    setShowSuccessModal(true);
  };

  const buildCustomInquiryText = () => {
    const toppings = selectedToppings
      .map(t => toppingsOptions.find(opt => opt.id === t)?.name || t)
      .join(', ') || 'Standard / baker recommended';

    return [
      '*New Custom Cake Inquiry from Cakeasy.in*',
      '',
      `*Shape & tiers:* ${tiers} Tier ${shape} cake`,
      `*Weight:* ${weight}`,
      `*Flavor:* ${flavor}`,
      `*Frosting:* ${frostingStyle}, ${frostingColor}`,
      `*Toppings:* ${toppings}`,
      `*Cake message:* ${cakeMessage || 'None'}`,
      `*Target date:* ${deliveryDate || 'TBD'}`,
      `*Estimated quote:* Rs. ${calculateEstPrice().toLocaleString()} approx.`,
      `*Baker notes:* ${specialInstructions || 'None'}`,
      '',
      uploadedImage
        ? `I selected a reference image on the website (${uploadedImageName || 'reference image'}). I will attach it in this WhatsApp chat now.`
        : 'No reference image selected.',
      '',
      'Please contact me to finalize the design, price, pickup/delivery, and payment.'
    ].join('\n');
  };

  const openWhatsAppInquiry = () => {
    const phoneNumber = settings.whatsappNumber || '918810795004';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(buildCustomInquiryText())}`, '_blank', 'noopener,noreferrer');
  };

  const resetBuilder = () => {
    goToStep(1);
    setTiers(1);
    setShape('round');
    setWeight('1kg');
    setFlavor('Classic Madagascar Vanilla');
    setFrostingStyle('smooth');
    setFrostingColor('#F6B8C8');
    setSelectedToppings([]);
    setCakeMessage('');
    setSpecialInstructions('');
    setDeliveryDate('');
    setUploadedImage(null);
    setUploadedImageName('');
    setShowSuccessModal(false);
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* Header Info */}
      <div className="relative overflow-hidden bg-[#FFF5F8] rounded-[36px] p-8 sm:p-12 border border-[#F6B8C8]/25 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-[0_24px_70px_rgba(214,51,132,0.08)]">
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#F6B8C8]/35 blur-3xl" />
        <div className="relative space-y-4 max-w-2xl text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D63384] flex items-center justify-center lg:justify-start gap-1.5">
            <Sparkles className="h-4 w-4" /> Cakeasy design atelier
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1E1E] leading-tight">
            Build your cake like a guided studio brief.
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
            Choose the structure, flavour, colour story, garnish and reference image while the sticky preview updates like a miniature cake board.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-1">
            {['Sticky preview', 'Smooth step scroll', 'Live quote', 'WhatsApp handoff'].map((label) => (
              <span key={label} className="rounded-full bg-white/80 border border-pink-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D63384]">
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="relative bg-white/85 backdrop-blur p-6 rounded-3xl shrink-0 text-center shadow-[0_20px_45px_rgba(214,51,132,0.12)] border border-white">
          <span className="text-xs tracking-wider uppercase text-gray-400 block font-semibold">Estimated Boutique Quote</span>
          <span className="text-4xl font-serif font-bold text-[#D63384]">₹{calculateEstPrice().toLocaleString()}</span>
          <p className="text-[10px] text-gray-400 mt-1">Finalized after Neha's review</p>
        </div>
      </div>

      {/* Main Workspace: Left Controls (Steps) - Right 3D style Preview */}
      <div id="cakeasy-builder-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
        {/* LEFT COLUMN: INTERACTIVE CONTROLS (7/12) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#FFF5F8] shadow-sm space-y-8">
          
          {/* Step Indicator bar */}
          <div className="space-y-4 border-b border-gray-50 pb-5">
            <div className="flex justify-between items-center text-xs text-gray-400 font-semibold">
              <span>Step {step} of 5</span>
              <span className="text-[#D63384]">{activeStepCard.title}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {stepCards.map((card) => {
                const Icon = card.icon;
                const isActive = step === card.step;
                const isComplete = step > card.step;
                return (
                  <button
                    key={card.step}
                    type="button"
                    onClick={() => goToStep(card.step)}
                    className={`text-left rounded-2xl border p-3 transition-all duration-500 ease-premium ${
                      isActive
                        ? 'border-[#D63384] bg-[#FFF5F8] shadow-[0_12px_30px_rgba(214,51,132,0.10)] -translate-y-0.5'
                        : isComplete
                          ? 'border-pink-100 bg-white text-gray-500'
                          : 'border-gray-100 bg-neutral-50/60 text-gray-400 hover:bg-white'
                    }`}
                  >
                    <span className={`h-8 w-8 rounded-xl flex items-center justify-center mb-2 ${
                      isActive ? 'bg-[#D63384] text-white' : isComplete ? 'bg-[#FFF5F8] text-[#D63384]' : 'bg-white text-gray-300'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="block text-[11px] font-black uppercase tracking-wider text-[#1E1E1E]">{card.title}</span>
                    <span className="block text-[9px] text-gray-400 mt-0.5">{card.eyebrow}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: BASIS (tiers, shape, weight) */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">Step 1: Choose Layers & Dimensions</h2>
              
              {/* Tiers selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Tiers / Structure</label>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTiers(t as any)}
                      className={`py-4 rounded-2xl border text-center transition-all ${
                        tiers === t 
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-semibold ring-1 ring-[#D63384]' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <Cake className="h-5 w-5 mx-auto mb-1.5" />
                      <span className="text-xs block">{t} {t === 1 ? 'Tier' : 'Tiers'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Cake Base Shape</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'round', label: 'Classic Round', icon: '◯' },
                    { id: 'square', label: 'Modern Square', icon: '⬜' },
                    { id: 'heart', label: 'Vintage Heart', icon: '❤️' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id as any)}
                      className={`py-4 rounded-2xl border text-center transition-all ${
                        shape === s.id 
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-semibold ring-1 ring-[#D63384]' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="text-lg block mb-1">{s.icon}</span>
                      <span className="text-xs block">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Preferred Weight</label>
                <div className="grid grid-cols-4 gap-3">
                  {['0.5kg', '1kg', '2kg', '3kg', '5kg+'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`py-3 rounded-xl border text-xs text-center transition-all ${
                        weight === w 
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-bold ring-1 ring-[#D63384]' 
                          : 'border-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FLAVORS & FROSTING STYLE */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">Step 2: Choose Flavor & Frosting Profile</h2>

              {/* Flavor Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Signature Flavor profile</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {POPULAR_FLAVORS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFlavor(f)}
                      className={`px-4 py-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        flavor === f
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-semibold'
                          : 'border-gray-100 text-gray-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{f}</span>
                      {flavor === f && <CheckCircle2 className="h-4 w-4 text-[#D63384]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frosting Style */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Frosting Texture</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'smooth', label: 'Classic Smooth', desc: 'Sleek premium finish' },
                    { id: 'rustic', label: 'Rustic Naked', desc: 'Charming scrape look' },
                    { id: 'textured', label: 'Swirl Textured', desc: 'Artsy retro patterns' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFrostingStyle(style.id as any)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        frostingStyle === style.id
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-semibold'
                          : 'border-gray-100 text-gray-500 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-xs block font-bold">{style.label}</span>
                      <span className="text-[10px] block text-gray-400 mt-0.5">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COLOR PALETTE & MASSAGE */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">Step 3: Color Palette & Message</h2>

              {/* Frosting Color Swatches */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Buttercream Color Palette</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {frostingColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setFrostingColor(color.hex)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                        frostingColor === color.hex
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-bold ring-1 ring-[#D63384]'
                          : 'border-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                    >
                      <span 
                        className="h-6 w-6 rounded-full border border-neutral-200 block"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[9px] font-semibold">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message on Cake */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Custom piped message</label>
                <input
                  type="text"
                  maxLength={40}
                  placeholder="e.g., Happy 30th Pooja! ❤️ (Max 40 characters)"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                />
                <p className="text-[10px] text-gray-400">Piped in contrasting elegant vanilla royal icing</p>
              </div>
            </div>
          )}

          {/* STEP 4: PREMIUM TOPPINGS */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">Step 4: Select Premium Garnishes</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {toppingsOptions.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => handleToppingToggle(topping.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] font-semibold'
                          : 'border-gray-100 hover:bg-neutral-50 text-gray-600'
                      }`}
                    >
                      <div>
                        <span className="text-xs block font-semibold">{topping.name}</span>
                        <span className="text-[10px] text-gray-400">{topping.price} surcharge</span>
                      </div>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-[#D63384] border-[#D63384] text-white' : 'border-gray-200'
                      }`}>
                        {isSelected && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: REFERENCE & LOGISTICS */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="font-serif text-xl font-bold text-[#1E1E1E]">Step 5: Reference Image & Schedule</h2>

              {/* Reference Image Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Upload design reference (Optional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-[#D63384] transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {uploadedImage ? (
                    <div className="space-y-2">
                      <img src={uploadedImage} alt="Uploaded reference preview" className="h-20 mx-auto rounded-lg object-cover" />
                      <p className="text-xs text-emerald-600 font-semibold">Reference image saved for this inquiry.</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-xs mx-auto">{uploadedImageName}</p>
                      <p className="text-[10px] text-gray-500 max-w-sm mx-auto">
                        When WhatsApp opens, please attach this same image in the chat so Neha can review the exact design.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-[#D63384] mx-auto" />
                      <p className="text-xs font-bold text-[#1E1E1E]">Drag and drop your Pinterest reference photo</p>
                      <p className="text-[10px] text-gray-400">Supports PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery date and special directions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#D63384]" /> Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#D63384]" /> Baker Notes
                  </label>
                  <textarea
                    rows={1}
                    placeholder="Allergies, color shades, etc."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full bg-neutral-50 border border-gray-100 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-50">
            <button
              onClick={() => goToStep(step - 1)}
              disabled={step === 1}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase transition-all ${
                step === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-neutral-50 border border-gray-100'
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < 5 ? (
              <button
                onClick={() => goToStep(step + 1)}
                className="bg-[#D63384] hover:bg-[#b02266] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleCompleteInquiry}
                disabled={!deliveryDate}
                className={`font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all ${
                  deliveryDate 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save Design & WhatsApp Neha <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY ATELIER PREVIEW (5/12) */}
        <div ref={studioRef} className="lg:col-span-5 sticky top-24">
          <div className={`relative overflow-hidden rounded-[36px] border border-pink-100 bg-white p-5 shadow-[0_28px_80px_rgba(214,51,132,0.12)] transition-all duration-700 ease-premium ${
            studioVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'
          }`}>
            <div className="absolute inset-0 opacity-80" style={{
              background: `radial-gradient(circle at 50% 22%, ${frostingColor}55, transparent 38%), linear-gradient(135deg, #fff 0%, #fff7fa 48%, #f8f0e8 100%)`
            }} />
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/80 blur-2xl" />
            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 border border-pink-100 px-3 py-1 text-[10px] text-[#D63384] font-black tracking-widest uppercase">
                    <ActiveStepIcon className="h-3.5 w-3.5" /> Live cake board
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1E1E1E] mt-3">{activeStepCard.title} preview</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sticky, eased and illustrative — the cake board updates as the customer moves through each design decision.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1E1E1E] text-white px-4 py-3 text-right shadow-lg">
                  <span className="block text-[9px] uppercase tracking-widest text-white/55">Quote</span>
                  <span className="font-serif text-xl font-bold">Rs. {calculateEstPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[32px] bg-[#1E1E1E] min-h-[430px] border border-white/60 shadow-inner">
                <div className="absolute inset-0 opacity-35" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '28px 28px'
                }} />
                <div className="absolute inset-x-8 top-8 h-36 rounded-full blur-3xl opacity-60" style={{ backgroundColor: frostingColor }} />
                <div className="absolute left-5 top-5 rounded-full border border-white/15 px-3 py-1 text-[9px] uppercase tracking-widest text-white/60">
                  {shape} / {weight}
                </div>
                <div className="absolute right-5 top-5 flex items-center gap-1 text-white/65 text-[10px]">
                  <Ruler className="h-3 w-3" /> {tiers} tier{tiers === 1 ? '' : 's'}
                </div>

                <div className="relative flex min-h-[430px] flex-col items-center justify-end px-6 pb-16 pt-24">
                  {cakeMessage && (
                    <div className="mb-5 max-w-[230px] rounded-2xl border border-white/80 bg-white px-4 py-2 text-center text-[11px] font-black text-[#D63384] shadow-xl animate-float-soft truncate">
                      "{cakeMessage}"
                    </div>
                  )}

                  <div className="relative flex flex-col items-center justify-end">
                    {tiers === 3 && (
                      <div
                        className="relative h-14 w-32 overflow-hidden border-b border-white/40 shadow-[0_12px_25px_rgba(0,0,0,0.16)] transition-all duration-700 ease-premium"
                        style={{
                          backgroundColor: frostingColor,
                          borderRadius: shape === 'square' ? '12px 12px 4px 4px' : shape === 'heart' ? '42px 42px 14px 14px' : '999px 999px 18px 18px',
                          backgroundImage: frostingStyle === 'textured' ? 'repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0 8px, transparent 8px 16px)' : frostingStyle === 'rustic' ? 'linear-gradient(90deg, rgba(255,255,255,.26), transparent 45%, rgba(0,0,0,.05))' : 'linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,0))'
                        }}
                      >
                        <div className="absolute inset-x-0 bottom-2 h-2 bg-black/5" />
                      </div>
                    )}

                    {(tiers === 2 || tiers === 3) && (
                      <div
                        className="relative -mt-1 h-16 w-44 overflow-hidden border-b border-white/40 shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-all duration-700 ease-premium"
                        style={{
                          backgroundColor: frostingColor,
                          borderRadius: shape === 'square' ? '14px 14px 5px 5px' : shape === 'heart' ? '54px 54px 18px 18px' : '999px 999px 20px 20px',
                          backgroundImage: frostingStyle === 'textured' ? 'repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0 9px, transparent 9px 18px)' : frostingStyle === 'rustic' ? 'linear-gradient(90deg, rgba(255,255,255,.26), transparent 45%, rgba(0,0,0,.05))' : 'linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,0))'
                        }}
                      >
                        {selectedToppings.includes('rose') && (
                          <div className="absolute left-4 top-3 flex gap-1">
                            <span className="h-4 w-4 rounded-full bg-[#D63384]" />
                            <span className="h-3 w-3 rounded-full bg-[#F6B8C8]" />
                          </div>
                        )}
                        {selectedToppings.includes('gold') && <span className="absolute right-5 top-4 h-2 w-8 rotate-[-18deg] rounded-full bg-[#D9A441]" />}
                      </div>
                    )}

                    <div
                      className="relative -mt-1 h-20 w-56 overflow-hidden border-b border-white/40 shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition-all duration-700 ease-premium"
                      style={{
                        backgroundColor: frostingColor,
                        borderRadius: shape === 'square' ? '16px 16px 6px 6px' : shape === 'heart' ? '66px 66px 22px 22px' : '999px 999px 24px 24px',
                        backgroundImage: frostingStyle === 'textured' ? 'repeating-linear-gradient(135deg, rgba(255,255,255,.22) 0 10px, transparent 10px 20px)' : frostingStyle === 'rustic' ? 'linear-gradient(90deg, rgba(255,255,255,.28), transparent 42%, rgba(0,0,0,.06))' : 'linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0))'
                      }}
                    >
                      {selectedToppings.includes('drip') && (
                        <div className="absolute inset-x-0 top-0 flex justify-around">
                          {[14, 24, 18, 30, 20, 26].map((height, index) => (
                            <span key={index} className="w-2 rounded-b-full bg-white/65" style={{ height }} />
                          ))}
                        </div>
                      )}
                      {selectedToppings.includes('sprinkles') && (
                        <div className="absolute inset-0">
                          {[18, 34, 52, 68, 82].map((left, index) => (
                            <span key={left} className="absolute h-1.5 w-5 rounded-full bg-white/70" style={{ left: `${left}%`, top: `${22 + (index % 3) * 14}%`, transform: `rotate(${index * 28}deg)` }} />
                          ))}
                        </div>
                      )}
                      {selectedToppings.includes('macaron') && (
                        <div className="absolute right-4 bottom-3 flex -space-x-1">
                          <span className="h-7 w-7 rounded-full bg-[#F6B8C8] border-2 border-white/60" />
                          <span className="h-7 w-7 rounded-full bg-[#E2D4F0] border-2 border-white/60" />
                        </div>
                      )}
                    </div>

                    {selectedToppings.includes('berry') && (
                      <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 gap-1">
                        <span className="h-5 w-5 rounded-full bg-red-500 shadow-lg" />
                        <span className="h-4 w-4 rounded-full bg-purple-500 shadow-lg" />
                        <span className="h-5 w-5 rounded-full bg-red-400 shadow-lg" />
                      </div>
                    )}

                    <div className={`${plateWidth} h-4 rounded-full bg-gradient-to-r from-[#D9A441] via-[#F8E6A0] to-[#B77B22] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition-all duration-700 ease-premium`} />
                    <div className="h-8 w-24 rounded-b-3xl bg-[#B77B22]/90" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Structure', `${tiers} tier ${shape}, ${weight}`],
                  ['Frosting', `${selectedFrostingName}, ${frostingStyle}`],
                  ['Flavour', flavor],
                  ['Garnish', selectedToppingNames.length ? `${selectedToppingNames.length} selected` : 'Classic finish'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-pink-50 bg-white/85 p-3">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{label}</p>
                    <p className="text-xs font-bold text-[#1E1E1E] mt-1 line-clamp-2">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D STYLE VISUAL CAKE PREVIEW (5/12) */}
        <div className="hidden">
          <span className="text-[10px] text-[#D63384] font-bold tracking-widest uppercase mb-6 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
            Real-time Boutique Render
          </span>

          {/* Interactive CSS cake container based on states */}
          <div className="w-full aspect-square flex flex-col items-center justify-center relative min-h-[300px]">
            {/* Ambient Background Glow matching the chosen color */}
            <div 
              className="absolute h-56 w-56 rounded-full blur-[100px] opacity-15 transition-all duration-500"
              style={{ backgroundColor: frostingColor }}
            />

            {/* Render Cake Tiers */}
            <div className="flex flex-col items-center justify-end w-full h-full pb-8">
              {/* Message Banner on top of cake */}
              {cakeMessage && (
                <div className="bg-white px-3 py-1.5 rounded-lg border border-[#FFF5F8] text-[10px] font-semibold text-[#D63384] shadow-sm mb-4 animate-bounce max-w-[200px] truncate">
                  ✍️ "{cakeMessage}"
                </div>
              )}

              {/* Tier 3 (Top tier - rendered if 3 tiers) */}
              {tiers === 3 && (
                <div 
                  className={`w-28 h-12 rounded-t-xl transition-all duration-500 shadow-sm relative border-b-2 border-white/20`}
                  style={{ 
                    backgroundColor: frostingColor, 
                    borderRadius: shape === 'heart' ? '14px 14px 0 0' : shape === 'square' ? '6px 6px 0 0' : '24px 24px 0 0',
                    borderStyle: frostingStyle === 'rustic' ? 'dashed' : 'solid'
                  }}
                >
                  <div className="absolute inset-x-0 bottom-1 h-1.5 bg-black/5" />
                  {/* Toppings decorator representation */}
                  {selectedToppings.includes('berry') && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-xs">🍓🍒</span>
                  )}
                </div>
              )}

              {/* Tier 2 (Middle tier - rendered if 2 or 3 tiers) */}
              {(tiers === 2 || tiers === 3) && (
                <div 
                  className={`w-36 h-14 transition-all duration-500 shadow-sm relative border-b-2 border-white/20`}
                  style={{ 
                    backgroundColor: frostingColor,
                    borderRadius: shape === 'heart' ? '18px 18px 0 0' : shape === 'square' ? '6px 6px 0 0' : '28px 28px 0 0',
                    borderStyle: frostingStyle === 'rustic' ? 'dashed' : 'solid',
                    marginTop: '-2px'
                  }}
                >
                  <div className="absolute inset-x-0 bottom-1 h-1.5 bg-black/5" />
                  {selectedToppings.includes('rose') && (
                    <span className="absolute -left-1 top-1 text-xs">🌹</span>
                  )}
                  {selectedToppings.includes('gold') && (
                    <span className="absolute right-4 top-2 text-[10px] animate-pulse">✨</span>
                  )}
                </div>
              )}

              {/* Tier 1 (Base tier - always rendered) */}
              <div 
                className={`w-44 h-16 transition-all duration-500 shadow-md relative`}
                style={{ 
                  backgroundColor: frostingColor,
                  borderRadius: shape === 'heart' ? '24px 24px 0 0' : shape === 'square' ? '6px 6px 0 0' : '32px 32px 0 0',
                  borderStyle: frostingStyle === 'rustic' ? 'dashed' : 'solid',
                  marginTop: '-2px'
                }}
              >
                {/* Drip overlay style */}
                {selectedToppings.includes('drip') && (
                  <div className="absolute top-0 inset-x-0 h-4 bg-white/60 rounded-t-lg flex justify-around">
                    <span className="w-1.5 h-3 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-4 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-2.5 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-4.5 bg-white/60 rounded-full" />
                    <span className="w-1.5 h-3.5 bg-white/60 rounded-full" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-1.5 h-2 bg-black/5" />
                {selectedToppings.includes('macaron') && (
                  <span className="absolute -right-2 bottom-1 text-xs">🧁🍪</span>
                )}
                {selectedToppings.includes('gold') && (
                  <span className="absolute left-6 top-6 text-[10px] animate-pulse">✨</span>
                )}
              </div>

              {/* Gold/Cake Plate Stand */}
              <div className="w-56 h-3 bg-[#e7dcd3] rounded-full shadow-sm mt-0.5 border-b-2 border-[#d4c1b2] relative">
                <div className="w-24 h-5 bg-[#d4c1b2] mx-auto rounded-b-xl" />
              </div>
            </div>
          </div>

          {/* Config Specs list */}
          <div className="w-full bg-white rounded-2xl p-4 border border-neutral-100 text-xs text-gray-500 space-y-2">
            <h4 className="font-bold text-[#1E1E1E] uppercase tracking-wider text-[10px]">Active Design Recipe</h4>
            <div className="flex justify-between">
              <span>Tiers Configuration:</span>
              <span className="font-bold text-gray-700">{tiers} Tier(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Boutique Shape:</span>
              <span className="font-bold text-gray-700 uppercase">{shape}</span>
            </div>
            <div className="flex justify-between">
              <span>Selected Weight:</span>
              <span className="font-bold text-gray-700">{weight}</span>
            </div>
            <div className="flex justify-between">
              <span>Primary Flavor:</span>
              <span className="font-bold text-gray-700">{flavor.split(' ').slice(-2).join(' ')}</span>
            </div>
            {selectedToppings.length > 0 && (
              <div className="flex justify-between">
                <span>Garnishes:</span>
                <span className="font-bold text-gray-700 text-right truncate max-w-[150px]">
                  {selectedToppings.length} selected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal Dialogue */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-[#FFF5F8] text-center space-y-6 animate-scaleIn">
            <span className="text-4xl">🎉</span>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl text-[#1E1E1E]">Bake Inquiry Submitted!</h3>
              <p className="text-sm text-gray-500">
                Your custom cake design has been saved in this session. Send it on WhatsApp now so Cakeasy can confirm the final design and quote.
              </p>
            </div>
            <div className="bg-[#FFF5F8] p-4 rounded-2xl text-xs text-left text-gray-600 space-y-1.5 border border-pink-50">
              <p><span className="font-bold">Base Shape:</span> {shape} base ({tiers} tiers)</p>
              <p><span className="font-bold">Flavor Chosen:</span> {flavor}</p>
              <p><span className="font-bold">Message:</span> {cakeMessage || 'No Message'}</p>
              <p><span className="font-bold">Reference Image:</span> {uploadedImage ? `Selected (${uploadedImageName || 'image'})` : 'Not selected'}</p>
              {uploadedImage && (
                <p className="text-[#D63384] font-semibold pt-1">
                  WhatsApp cannot auto-attach private browser files. Please attach this reference image after the chat opens.
                </p>
              )}
              <p><span className="font-bold">Est. Price:</span> ₹{calculateEstPrice().toLocaleString()}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={resetBuilder}
                className="w-full py-3 bg-[#FFF5F8] text-[#D63384] text-xs font-semibold uppercase rounded-xl border border-pink-100"
              >
                Design Another
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  openWhatsAppInquiry();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase rounded-xl"
              >
                Open WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
