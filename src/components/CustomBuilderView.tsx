import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Cake,
  Calendar,
  CheckCircle2,
  FileText,
  Flower2,
  ImagePlus,
  Layers,
  Palette,
  Sparkles,
  Upload,
  Wand2
} from 'lucide-react';
import { POPULAR_FLAVORS } from '../data';
import { AtelierSettings, CustomCakeState } from '../types';

interface CustomBuilderViewProps {
  onAddCustomInquiry: (cake: CustomCakeState, date: string, notes: string) => void;
  settings: AtelierSettings;
}

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
  { step: 1, title: 'Structure', eyebrow: 'Sponge stack', icon: Layers, action: 'Build the cake base' },
  { step: 2, title: 'Flavour', eyebrow: 'Cream + filling', icon: Cake, action: 'Fill and crumb coat' },
  { step: 3, title: 'Palette', eyebrow: 'Colour + message', icon: Palette, action: 'Smooth the frosting' },
  { step: 4, title: 'Garnish', eyebrow: 'Decorate', icon: Flower2, action: 'Pipe and finish' },
  { step: 5, title: 'Brief', eyebrow: 'Reference + date', icon: ImagePlus, action: 'Pack the brief' },
];

const shapeLabels = [
  { id: 'round', label: 'Round', note: 'Classic celebration' },
  { id: 'square', label: 'Square', note: 'Sharp modern edges' },
  { id: 'heart', label: 'Heart', note: 'Vintage romantic' },
] as const;

const weightOptions = ['0.5kg', '1kg', '2kg', '3kg', '5kg+'];

export default function CustomBuilderView({ onAddCustomInquiry, settings }: CustomBuilderViewProps) {
  const [step, setStep] = useState(1);
  const [tiers, setTiers] = useState<1 | 2 | 3>(1);
  const [shape, setShape] = useState<'round' | 'square' | 'heart'>('round');
  const [weight, setWeight] = useState('1kg');
  const [flavor, setFlavor] = useState('Classic Madagascar Vanilla');
  const [frostingStyle, setFrostingStyle] = useState<'smooth' | 'rustic' | 'textured'>('smooth');
  const [frostingColor, setFrostingColor] = useState('#F6B8C8');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [cakeMessage, setCakeMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [studioVisible, setStudioVisible] = useState(false);
  const studioRef = useRef<HTMLDivElement | null>(null);

  const selectedFrostingName = frostingColors.find(color => color.hex === frostingColor)?.name || 'Custom shade';
  const selectedToppingNames = selectedToppings.map(t => toppingsOptions.find(opt => opt.id === t)?.name || t);
  const activeStepCard = stepCards[step - 1];
  const ActiveStepIcon = activeStepCard.icon;

  const plateWidth = useMemo(() => {
    if (weight === '0.5kg') return 210;
    if (weight === '2kg') return 280;
    if (weight === '3kg') return 315;
    if (weight === '5kg+') return 350;
    return 245;
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

  const calculateEstPrice = () => {
    let base = settings.base1Tier || 999;
    if (tiers === 2) base = settings.base2Tiers || 2499;
    if (tiers === 3) base = settings.base3Tiers || 4999;

    let weightFactor = 1;
    if (weight === '0.5kg') weightFactor = 0.6;
    if (weight === '2kg') weightFactor = 1.8;
    if (weight === '3kg') weightFactor = 2.6;
    if (weight === '5kg+') weightFactor = 4.2;

    return Math.round(base * weightFactor + selectedToppings.length * 200);
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

  const handleToppingToggle = (id: string) => {
    setSelectedToppings(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const selectedToppingText = selectedToppingNames.join(', ') || 'Standard / baker recommended';

  const buildCustomInquiryText = () => [
    '*New Custom Cake Inquiry from Cakeasy.in*',
    '',
    `*Shape & tiers:* ${tiers} Tier ${shape} cake`,
    `*Weight:* ${weight}`,
    `*Flavor:* ${flavor}`,
    `*Frosting:* ${frostingStyle}, ${selectedFrostingName}`,
    `*Toppings:* ${selectedToppingText}`,
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

  const openWhatsAppInquiry = () => {
    const phoneNumber = settings.whatsappNumber || '918810795004';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(buildCustomInquiryText())}`, '_blank', 'noopener,noreferrer');
  };

  const handleCompleteInquiry = () => {
    const customCake: CustomCakeState = {
      tiers,
      shape,
      weight,
      flavor,
      frostingColor,
      frostingStyle,
      toppings: selectedToppingNames,
      message: cakeMessage,
      referenceImageName: uploadedImageName || undefined,
      referenceAttached: Boolean(uploadedImage),
    };

    onAddCustomInquiry(customCake, deliveryDate, specialInstructions);
    setShowSuccessModal(true);
  };

  const resetBuilder = () => {
    setStep(1);
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

  const layerWidths = tiers === 1 ? [250] : tiers === 2 ? [185, 260] : [145, 205, 285];
  const cakeSurface = step >= 3 ? frostingColor : step >= 2 ? '#FFF7F1' : '#D99A5D';
  const cakeSide = step >= 3 ? frostingColor : step >= 2 ? '#FFECE3' : '#B87439';
  const showDecor = step >= 4;

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      <section className="relative overflow-hidden rounded-[36px] border border-[#F6B8C8]/25 bg-[#FFF5F8] p-8 sm:p-12 shadow-[0_24px_70px_rgba(214,51,132,0.08)]">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/75 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#F6B8C8]/40 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4 text-center lg:text-left">
            <span className="inline-flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D63384]">
              <Wand2 className="h-4 w-4" /> Cakeasy cake lab
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-[#1E1E1E]">
              Watch your custom cake come together.
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500 lg:mx-0">
              Build the structure, add sponge and filling, smooth the frosting, decorate it, then send Neha a proper WhatsApp brief with the reference image note.
            </p>
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {['Build animation', 'Sticky preview', 'Smooth step scroll', 'WhatsApp-ready brief'].map(label => (
                <span key={label} className="rounded-full border border-pink-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#D63384]">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/85 p-6 text-center shadow-[0_20px_45px_rgba(214,51,132,0.12)] backdrop-blur">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Estimated quote</span>
            <span className="font-serif text-4xl font-bold text-[#D63384]">₹{calculateEstPrice().toLocaleString()}</span>
            <p className="mt-1 text-[10px] text-gray-400">Final price after baker review</p>
          </div>
        </div>
      </section>

      <div id="cakeasy-builder-workspace" className="grid grid-cols-1 items-start gap-8 scroll-mt-24 lg:grid-cols-12">
        <section className="lg:col-span-7 rounded-[32px] border border-[#FFF5F8] bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-4 border-b border-gray-50 pb-5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
              <span>Step {step} of 5</span>
              <span className="text-[#D63384]">{activeStepCard.action}</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
              {stepCards.map(card => {
                const Icon = card.icon;
                const isActive = step === card.step;
                const isComplete = step > card.step;

                return (
                  <button
                    key={card.step}
                    type="button"
                    onClick={() => goToStep(card.step)}
                    className={`rounded-2xl border p-3 text-left transition-all duration-500 ease-premium ${
                      isActive
                        ? 'border-[#D63384] bg-[#FFF5F8] shadow-[0_12px_30px_rgba(214,51,132,0.10)]'
                        : isComplete
                          ? 'border-pink-100 bg-white'
                          : 'border-gray-100 bg-neutral-50/60 hover:bg-white'
                    }`}
                  >
                    <span className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${
                      isActive ? 'bg-[#D63384] text-white' : isComplete ? 'bg-[#FFF5F8] text-[#D63384]' : 'bg-white text-gray-300'
                    }`}>
                      {isComplete && !isActive ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="block text-[11px] font-black uppercase tracking-wider text-[#1E1E1E]">{card.title}</span>
                    <span className="mt-0.5 block text-[9px] text-gray-400">{card.eyebrow}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-[430px] py-8">
            {step === 1 && (
              <div className="space-y-7 animate-fadeIn">
                <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Step 1: Shape the cake base</h2>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Tiers</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTiers(t as 1 | 2 | 3)}
                        className={`rounded-2xl border p-4 text-center transition-all ${tiers === t ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] ring-1 ring-[#D63384]' : 'border-gray-100 text-gray-600 hover:border-pink-100'}`}
                      >
                        <Layers className="mx-auto mb-2 h-5 w-5" />
                        <span className="block text-xs font-bold">{t} {t === 1 ? 'Tier' : 'Tiers'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Shape</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {shapeLabels.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setShape(option.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${shape === option.id ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] ring-1 ring-[#D63384]' : 'border-gray-100 text-gray-600 hover:border-pink-100'}`}
                      >
                        <span className="block text-sm font-black uppercase">{option.label}</span>
                        <span className="mt-1 block text-[10px] text-gray-400">{option.note}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Weight</label>
                  <div className="grid grid-cols-5 gap-2">
                    {weightOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setWeight(option)}
                        className={`rounded-xl border py-3 text-xs font-bold transition-all ${weight === option ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384]' : 'border-gray-100 text-gray-500 hover:bg-neutral-50'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7 animate-fadeIn">
                <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Step 2: Add sponge, filling and frosting</h2>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Signature flavour</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {POPULAR_FLAVORS.map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFlavor(option)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-xs transition-all ${flavor === option ? 'border-[#D63384] bg-[#FFF5F8] font-semibold text-[#D63384]' : 'border-gray-100 text-gray-600 hover:bg-neutral-50'}`}
                      >
                        <span>{option}</span>
                        {flavor === option && <CheckCircle2 className="h-4 w-4 text-[#D63384]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Frosting finish</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'smooth', label: 'Smooth', desc: 'Clean premium coat' },
                      { id: 'rustic', label: 'Rustic', desc: 'Hand-spread texture' },
                      { id: 'textured', label: 'Swirl', desc: 'Piped movement' },
                    ].map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFrostingStyle(option.id as 'smooth' | 'rustic' | 'textured')}
                        className={`rounded-xl border p-4 text-center transition-all ${frostingStyle === option.id ? 'border-[#D63384] bg-[#FFF5F8] font-semibold text-[#D63384]' : 'border-gray-100 text-gray-500 hover:bg-neutral-50'}`}
                      >
                        <span className="block text-xs font-bold">{option.label}</span>
                        <span className="mt-0.5 block text-[10px] text-gray-400">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-7 animate-fadeIn">
                <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Step 3: Choose the colour story</h2>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Buttercream palette</label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {frostingColors.map(color => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setFrostingColor(color.hex)}
                        className={`rounded-2xl border p-3 text-center transition-all ${frostingColor === color.hex ? 'border-[#D63384] bg-[#FFF5F8] text-[#D63384] ring-1 ring-[#D63384]' : 'border-gray-100 text-gray-500 hover:border-pink-100'}`}
                      >
                        <span className="mx-auto mb-1.5 block h-7 w-7 rounded-full border border-neutral-200" style={{ backgroundColor: color.hex }} />
                        <span className="text-[9px] font-semibold">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Cake message</label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="e.g., Happy Birthday Aria"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    className="w-full rounded-xl border border-gray-100 bg-neutral-50 px-4 py-3 text-xs text-[#1E1E1E] focus:border-[#D63384] focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-400">The preview adds this as a little piped plaque.</p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-7 animate-fadeIn">
                <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Step 4: Decorate the cake</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {toppingsOptions.map(topping => {
                    const isSelected = selectedToppings.includes(topping.id);
                    return (
                      <button
                        key={topping.id}
                        type="button"
                        onClick={() => handleToppingToggle(topping.id)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${isSelected ? 'border-[#D63384] bg-[#FFF5F8] font-semibold text-[#D63384]' : 'border-gray-100 text-gray-600 hover:bg-neutral-50'}`}
                      >
                        <span>
                          <span className="block text-xs font-bold">{topping.name}</span>
                          <span className="mt-0.5 block text-[10px] text-gray-400">{topping.price} surcharge</span>
                        </span>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-[#D63384] bg-[#D63384] text-white' : 'border-gray-200'}`}>
                          {isSelected && <CheckCircle2 className="h-4 w-4" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-7 animate-fadeIn">
                <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">Step 5: Add the reference and schedule</h2>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Upload design reference</label>
                  <div className="relative rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center transition-colors hover:border-[#D63384]">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 cursor-pointer opacity-0" />
                    {uploadedImage ? (
                      <div className="space-y-2">
                        <img src={uploadedImage} alt="Uploaded reference preview" className="mx-auto h-24 rounded-xl border border-pink-100 object-cover shadow-sm" />
                        <p className="text-xs font-semibold text-emerald-600">Reference image saved for this inquiry.</p>
                        <p className="mx-auto max-w-xs truncate text-[10px] text-gray-400">{uploadedImageName}</p>
                        <p className="mx-auto max-w-sm text-[10px] text-gray-500">
                          When WhatsApp opens, attach this same image in the chat so Neha can review the exact design.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-[#D63384]" />
                        <p className="text-xs font-bold text-[#1E1E1E]">Drop or click to add a reference image</p>
                        <p className="text-[10px] text-gray-400">PNG or JPG, up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                      <Calendar className="h-4 w-4 text-[#D63384]" /> Target date
                    </label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-100 bg-neutral-50 px-4 py-3 text-xs text-[#1E1E1E] focus:border-[#D63384] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
                      <FileText className="h-4 w-4 text-[#D63384]" /> Baker notes
                    </label>
                    <textarea
                      rows={1}
                      placeholder="Allergies, shade notes, theme details..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full rounded-xl border border-gray-100 bg-neutral-50 px-4 py-3 text-xs text-[#1E1E1E] focus:border-[#D63384] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              disabled={step === 1}
              className={`flex items-center gap-1.5 rounded-xl px-5 py-3 text-xs font-semibold uppercase transition-all ${step === 1 ? 'cursor-not-allowed text-gray-300' : 'border border-gray-100 text-gray-600 hover:bg-neutral-50'}`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => goToStep(step + 1)}
                className="flex items-center gap-1.5 rounded-xl bg-[#D63384] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#b02266]"
              >
                Build next layer <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteInquiry}
                disabled={!deliveryDate}
                className={`flex items-center gap-1.5 rounded-xl px-8 py-3.5 text-xs font-semibold uppercase tracking-wider shadow-md transition-all ${deliveryDate ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
              >
                Save design & WhatsApp Neha <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <aside ref={studioRef} className="lg:col-span-5 lg:sticky lg:top-24">
          <div className={`relative overflow-hidden rounded-[36px] border border-pink-100 bg-white p-5 shadow-[0_28px_80px_rgba(214,51,132,0.12)] transition-all duration-700 ease-premium ${studioVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-90'}`}>
            <div className="absolute inset-0 opacity-90" style={{ background: `radial-gradient(circle at 50% 20%, ${frostingColor}66, transparent 36%), linear-gradient(135deg, #fff 0%, #fff7fa 48%, #f8f0e8 100%)` }} />
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/80 blur-2xl" />

            <div className="relative space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white/85 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#D63384]">
                    <ActiveStepIcon className="h-3.5 w-3.5" /> Live build demo
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-bold text-[#1E1E1E]">{activeStepCard.action}</h3>
                  <p className="text-xs leading-relaxed text-gray-500">
                    The board now shows the cake being assembled phase by phase, instead of only changing labels.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1E1E1E] px-4 py-3 text-right text-white shadow-lg">
                  <span className="block text-[9px] uppercase tracking-widest text-white/55">Quote</span>
                  <span className="font-serif text-xl font-bold">Rs. {calculateEstPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-[#181818] shadow-inner">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                  backgroundSize: '28px 28px'
                }} />
                <div className="absolute left-6 top-6 z-10 rounded-full border border-white/15 px-3 py-1 text-[9px] uppercase tracking-widest text-white/60">
                  {shape} / {weight}
                </div>
                <div className="absolute right-6 top-6 z-10 rounded-full bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/65">
                  Step {step}
                </div>

                <div className="relative flex min-h-[460px] flex-col items-center justify-end px-6 pb-16 pt-24">
                  <div className="absolute inset-x-10 top-16 h-40 rounded-full blur-3xl opacity-55" style={{ backgroundColor: frostingColor }} />

                  <div className="absolute left-6 top-20 hidden space-y-2 md:block">
                    {stepCards.map(card => (
                      <div key={card.step} className={`flex items-center gap-2 text-[10px] transition-all ${step >= card.step ? 'text-white' : 'text-white/35'}`}>
                        <span className={`h-2 w-2 rounded-full ${step >= card.step ? 'bg-[#F6B8C8]' : 'bg-white/20'}`} />
                        <span>{card.title}</span>
                      </div>
                    ))}
                  </div>

                  {step >= 2 && (
                    <div className="absolute right-10 top-24 h-24 w-6 rotate-[28deg] rounded-full bg-white/80 shadow-xl animate-palette-sweep">
                      <span className="absolute -bottom-8 left-1/2 h-10 w-2 -translate-x-1/2 rounded-full bg-[#A36A2D]" />
                    </div>
                  )}

                  {step >= 4 && (
                    <div className="absolute right-12 bottom-28 h-24 w-10 -rotate-12 rounded-t-full bg-[#F6B8C8] shadow-xl animate-piping-bag">
                      <span className="absolute -bottom-3 left-1/2 h-4 w-2 -translate-x-1/2 rotate-12 bg-white" />
                    </div>
                  )}

                  {cakeMessage && step >= 3 && (
                    <div className="mb-5 max-w-[240px] rounded-2xl border border-white/80 bg-white px-4 py-2 text-center text-[11px] font-black text-[#D63384] shadow-xl animate-float-soft truncate">
                      “{cakeMessage}”
                    </div>
                  )}

                  <div className="relative flex flex-col items-center justify-end">
                    {layerWidths.map((width, index) => {
                      const isBase = index === layerWidths.length - 1;
                      const delay = `${index * 120}ms`;

                      return (
                        <div key={`${tiers}-${index}`} className="-mt-2 flex flex-col items-center animate-cake-layer-rise" style={{ animationDelay: delay }}>
                          <div
                            className="relative h-8 border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-700 ease-premium"
                            style={{
                              width,
                              background: `linear-gradient(180deg, ${cakeSurface}, ${cakeSide})`,
                              borderRadius: shape === 'square' ? '14px 14px 7px 7px' : shape === 'heart' ? '50% 50% 18px 18px' : '50%',
                            }}
                          >
                            {step === 1 && <span className="absolute inset-x-8 top-3 h-1 rounded-full bg-[#8D5524]/30" />}
                            {step >= 2 && <span className="absolute inset-x-4 top-3 h-1.5 rounded-full bg-white/45 animate-crumb-coat" />}
                          </div>
                          <div
                            className="relative -mt-4 overflow-hidden border-x border-b border-white/20 shadow-[0_16px_34px_rgba(0,0,0,0.20)] transition-all duration-700 ease-premium"
                            style={{
                              width,
                              height: isBase ? 72 : 58,
                              background: step >= 2
                                ? `linear-gradient(110deg, ${cakeSide}, ${cakeSurface} 48%, rgba(255,255,255,.38))`
                                : 'linear-gradient(110deg, #B87439, #D99A5D 48%, #EFC083)',
                              borderRadius: shape === 'square' ? '8px 8px 16px 16px' : shape === 'heart' ? '20px 20px 36px 36px' : '0 0 44px 44px',
                            }}
                          >
                            {step >= 2 && (
                              <span className="absolute inset-y-0 left-0 w-full origin-left bg-white/20 animate-frosting-sweep" />
                            )}
                            {frostingStyle === 'textured' && step >= 3 && (
                              <span className="absolute inset-0 opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.30) 0 7px, transparent 7px 14px)' }} />
                            )}
                            {frostingStyle === 'rustic' && step >= 3 && (
                              <span className="absolute inset-x-5 top-6 h-1 rounded-full bg-white/35" />
                            )}
                            {showDecor && selectedToppings.includes('drip') && isBase && (
                              <div className="absolute inset-x-0 top-0 flex justify-around">
                                {[18, 30, 22, 36, 24, 28].map((height, dripIndex) => (
                                  <span key={dripIndex} className="w-2 rounded-b-full bg-white/70 animate-drip-drop" style={{ height, animationDelay: `${dripIndex * 90}ms` }} />
                                ))}
                              </div>
                            )}
                            {showDecor && selectedToppings.includes('sprinkles') && (
                              <div className="absolute inset-0">
                                {[16, 31, 48, 66, 82].map((left, sprinkleIndex) => (
                                  <span key={left} className="absolute h-1.5 w-5 rounded-full bg-white/70 animate-decor-pop" style={{ left: `${left}%`, top: `${24 + (sprinkleIndex % 3) * 14}%`, transform: `rotate(${sprinkleIndex * 28}deg)`, animationDelay: `${sprinkleIndex * 80}ms` }} />
                                ))}
                              </div>
                            )}
                            {showDecor && selectedToppings.includes('gold') && (
                              <span className="absolute right-6 top-5 h-2 w-10 rotate-[-18deg] rounded-full bg-[#D9A441] shadow-[0_0_18px_rgba(217,164,65,0.65)] animate-decor-pop" />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {showDecor && (selectedToppings.includes('rose') || selectedToppings.length === 0) && (
                      <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 items-end gap-1 animate-decor-pop">
                        <span className="h-6 w-6 rounded-full bg-[#D63384] shadow-lg" />
                        <span className="h-4 w-4 rounded-full bg-[#F6B8C8] shadow-lg" />
                        <span className="h-5 w-5 rounded-full bg-[#E2D4F0] shadow-lg" />
                      </div>
                    )}

                    {showDecor && selectedToppings.includes('berry') && (
                      <div className="absolute -top-12 right-10 flex gap-1 animate-decor-pop">
                        <span className="h-5 w-5 rounded-full bg-red-500 shadow-lg" />
                        <span className="h-4 w-4 rounded-full bg-purple-500 shadow-lg" />
                      </div>
                    )}

                    {showDecor && selectedToppings.includes('macaron') && (
                      <div className="absolute bottom-10 right-3 flex -space-x-1 animate-decor-pop">
                        <span className="h-8 w-8 rounded-full border-2 border-white/60 bg-[#F6B8C8]" />
                        <span className="h-8 w-8 rounded-full border-2 border-white/60 bg-[#E2D4F0]" />
                      </div>
                    )}

                    <div className="mt-0 h-4 rounded-full bg-gradient-to-r from-[#B77B22] via-[#F8E6A0] to-[#B77B22] shadow-[0_12px_28px_rgba(0,0,0,0.28)] transition-all duration-700 ease-premium" style={{ width: plateWidth }} />
                    <div className="h-9 w-24 rounded-b-3xl bg-[#A36A2D]" />
                  </div>

                  {step >= 5 && (
                    <div className="absolute bottom-7 left-6 right-6 rounded-2xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur animate-decor-pop">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/55">Final brief</p>
                      <p className="mt-1 text-xs">
                        {uploadedImage ? `Reference attached: ${uploadedImageName}` : 'Ready for reference image + WhatsApp handoff'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Structure', `${tiers} tier ${shape}, ${weight}`],
                  ['Frosting', `${selectedFrostingName}, ${frostingStyle}`],
                  ['Flavour', flavor],
                  ['Garnish', selectedToppingNames.length ? `${selectedToppingNames.length} selected` : 'Signature finish'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-pink-50 bg-white/85 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                    <p className="mt-1 line-clamp-2 text-xs font-bold text-[#1E1E1E]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E1E1E]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-scaleIn space-y-6 rounded-[32px] border border-[#FFF5F8] bg-white p-8 text-center">
            <span className="text-4xl">🎂</span>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-[#1E1E1E]">Cake brief ready</h3>
              <p className="text-sm text-gray-500">
                Your custom cake design has been saved in this session. Send it on WhatsApp now so Cakeasy can confirm the final design and quote.
              </p>
            </div>

            <div className="space-y-1.5 rounded-2xl border border-pink-50 bg-[#FFF5F8] p-4 text-left text-xs text-gray-600">
              <p><span className="font-bold">Base:</span> {shape} base, {tiers} tier(s), {weight}</p>
              <p><span className="font-bold">Flavor:</span> {flavor}</p>
              <p><span className="font-bold">Frosting:</span> {selectedFrostingName}, {frostingStyle}</p>
              <p><span className="font-bold">Message:</span> {cakeMessage || 'No message'}</p>
              <p><span className="font-bold">Reference:</span> {uploadedImage ? `Selected (${uploadedImageName || 'image'})` : 'Not selected'}</p>
              <p><span className="font-bold">Est. price:</span> ₹{calculateEstPrice().toLocaleString()}</p>
              {uploadedImage && (
                <p className="pt-1 font-semibold text-[#D63384]">
                  WhatsApp cannot auto-attach private browser files. Please attach this reference image after the chat opens.
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={resetBuilder}
                className="w-full rounded-xl border border-pink-100 bg-[#FFF5F8] py-3 text-xs font-semibold uppercase text-[#D63384]"
              >
                Design another
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  openWhatsAppInquiry();
                }}
                className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-semibold uppercase text-white hover:bg-emerald-700"
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
