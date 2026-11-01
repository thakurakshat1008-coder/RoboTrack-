import React, { useState, useEffect } from 'react';
import { InventoryItem, ComponentCategory, Robot, User } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { 
  Cpu, 
  Plus, 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Bot, 
  DollarSign, 
  PackageCheck,
  MapPin,
  ExternalLink,
  Zap,
  Info,
  Radio,
  Sliders,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface InventoryViewProps {
  user: User;
  onNavigateToSimulator?: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ user, onNavigateToSimulator }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [copiedManifest, setCopiedManifest] = useState(false);

  const handleCopyPin = (pin: string) => {
    try {
      navigator.clipboard.writeText(pin);
      setCopiedPin(pin);
      setTimeout(() => setCopiedPin(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleCopyManifest = (item: InventoryItem) => {
    try {
      const manifest = {
        sku: item.sku,
        name: item.name,
        category: item.category,
        manufacturer: item.manufacturer,
        operatingVoltage: item.operatingVoltage,
        busProtocol: item.busProtocol,
        currentDraw: item.currentDraw,
        dimensions: item.dimensions,
        weight: item.weight,
        packageType: item.packageType,
        tolerance: item.tolerance,
        pinout: item.pinout,
        location: item.location
      };
      navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 2000);
    } catch {
      // ignore
    }
  };
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState<ComponentCategory>('Sensors');
  const [formQuantity, setFormQuantity] = useState(4);
  const [formMinThreshold, setFormMinThreshold] = useState(2);
  const [formPrice, setFormPrice] = useState(25);
  const [formManufacturer, setFormManufacturer] = useState('Adafruit Industries');
  const [formSpecs, setFormSpecs] = useState('');
  const [formLocation, setFormLocation] = useState('Bin C-04');
  const [formVoltage, setFormVoltage] = useState('3.3V - 5.0V DC');
  const [formBus, setFormBus] = useState('I2C / SPI');
  const [formCurrent, setFormCurrent] = useState('15mA');
  const [formDimensions, setFormDimensions] = useState('25 × 25 × 3 mm');
  const [formWeight, setFormWeight] = useState('4.5 g');
  const [formPinout, setFormPinout] = useState('VCC, GND, SDA, SCL');
  const [formPackage, setFormPackage] = useState('Breakout Board');
  const [formTolerance, setFormTolerance] = useState('±1%');
  const [formRobotId, setFormRobotId] = useState('');

  const categories: ComponentCategory[] = [
    'Motors',
    'Sensors',
    'Controllers',
    'Batteries',
    'Wheels',
    'Frames',
    'Communication Modules',
    'Other Components'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [iList, rList] = await Promise.all([
        api.getInventory(),
        api.getRobots()
      ]);
      setItems(iList);
      setRobots(rList);
      if (iList.length > 0 && !selectedItem) {
        setSelectedItem(iList[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleStockDelta = async (id: string, delta: number) => {
    try {
      const updated = await api.updateStock(id, delta);
      setItems(items.map(i => i.id === updated.id ? updated : i));
      if (selectedItem?.id === updated.id) {
        setSelectedItem(updated);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust stock');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const robot = robots.find(r => r.id === formRobotId);
      const created = await api.createInventoryItem({
        name: formName,
        sku: formSku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        category: formCategory,
        quantity: formQuantity,
        minThreshold: formMinThreshold,
        unitPriceUsd: formPrice,
        manufacturer: formManufacturer,
        specifications: formSpecs,
        location: formLocation,
        assignedRobotId: formRobotId || undefined,
        assignedRobotName: robot?.name,
        lastRestocked: new Date().toISOString().split('T')[0],
        operatingVoltage: formVoltage,
        busProtocol: formBus,
        currentDraw: formCurrent,
        dimensions: formDimensions,
        weight: formWeight,
        pinout: formPinout.split(',').map(s => s.trim()).filter(Boolean),
        packageType: formPackage,
        tolerance: formTolerance,
        inStock: formQuantity > 0,
        simulatorCompatible: formCategory === 'Sensors' || formCategory === 'Controllers' || formCategory === 'Motors'
      });
      setItems([created, ...items]);
      setSelectedItem(created);
      setIsAddOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add item');
    }
  };

  const lowStockItems = items.filter(i => i.quantity <= i.minThreshold);

  const filteredItems = items.filter(i => {
    const matchesSearch = 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.busProtocol && i.busProtocol.toLowerCase().includes(searchQuery.toLowerCase())) ||
      i.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#142136]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-tech text-xs tracking-wider uppercase text-[#82B2D8] font-medium">
              Robotics Hardware Catalog · BOM Subsystems
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#849B74]" />
            <span className="font-mono text-[10px] text-slate-400 dark:text-[#8996AA]">
              {items.length} Registered Parts
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            Robotics Component & Hardware Catalog
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#8996AA] mt-0.5">
            Full industrial specifications, bus protocols, pinouts, operating ranges, and live simulator rigs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onNavigateToSimulator && (
            <button
              onClick={onNavigateToSimulator}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg text-xs font-tech uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Launch Wokwi Sim</span>
            </button>
          )}

          {user.role !== 'viewer' && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#EADCC9] to-[#E8B4A2] hover:opacity-95 text-[#070B14] font-bold text-xs font-tech uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#070B14]" />
              <span>Register Component</span>
            </button>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
          <span className="font-mono">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/40 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-display uppercase tracking-tight text-amber-900 dark:text-amber-300">
                Low Stock Threshold Alert ({lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''})
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-sans">
                {lowStockItems.map(i => `${i.name} (${i.quantity} remaining, threshold ${i.minThreshold})`).join(' · ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded text-xs font-tech uppercase tracking-wider transition-colors ${
              selectedCategory === 'ALL' 
                ? 'bg-[#EADCC9]/30 text-slate-900 dark:text-[#EADCC9] font-bold border border-[#EADCC9]/50' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Subsystems ({items.length})
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded text-xs font-tech uppercase tracking-wider transition-colors ${
                selectedCategory === c 
                  ? 'bg-[#82B2D8]/20 text-[#82B2D8] font-bold border border-[#82B2D8]/40' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search SKU, bus, voltage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#82B2D8] text-xs font-sans placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* 2-Column Split: Inventory Table + Component Deep Property Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table of Components (7 cols) */}
        <div className="lg:col-span-7 p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#162238] text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wider">
                <th className="pb-3">SKU</th>
                <th className="pb-3">COMPONENT NAME</th>
                <th className="pb-3">BUS / PROTOCOL</th>
                <th className="pb-3 text-center">QTY</th>
                <th className="pb-3 text-right">UNIT ($)</th>
                {user.role !== 'viewer' && <th className="pb-3 text-right">STOCK</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#142136]">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isLow = item.quantity <= item.minThreshold;

                return (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-slate-100 dark:bg-[#121D30] font-medium' 
                        : 'hover:bg-slate-50 dark:hover:bg-[#111A2D]'
                    }`}
                  >
                    <td className="py-3 font-mono text-[#82B2D8] font-semibold whitespace-nowrap">
                      {item.sku}
                    </td>
                    <td className="py-3 max-w-[200px]">
                      <div className="font-display font-semibold text-slate-900 dark:text-slate-100 truncate tracking-tight text-sm">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-sans">
                        {item.manufacturer} · {item.operatingVoltage || 'Standard'}
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-[#1A263C] font-tech text-[10px] uppercase">
                        {item.busProtocol ? item.busProtocol.split('/')[0].split(',')[0] : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono tabular-nums whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isLow ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' : 'text-slate-900 dark:text-white'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap">
                      ${item.unitPriceUsd.toFixed(2)}
                    </td>
                    {user.role !== 'viewer' && (
                      <td className="py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleStockDelta(item.id, -1)}
                            className="w-6 h-6 rounded bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#1E2D4A] text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono cursor-pointer"
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleStockDelta(item.id, 1)}
                            className="w-6 h-6 rounded bg-slate-100 dark:bg-[#162238] hover:bg-slate-200 dark:hover:bg-[#1E2D4A] text-[#82B2D8] flex items-center justify-center font-mono cursor-pointer"
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Component Detailed Properties Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedItem ? (
            <div className="p-6 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl shadow-sm sticky top-20 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-[#162238]">
                <div>
                  <span className="text-xs font-mono text-[#82B2D8] font-bold">{selectedItem.sku}</span>
                  <h3 className="text-lg font-bold font-display uppercase tracking-tight text-slate-900 dark:text-white mt-0.5">
                    {selectedItem.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                    {selectedItem.category} · {selectedItem.manufacturer}
                  </div>
                </div>

                {selectedItem.simulatorCompatible && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-tech uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 flex items-center gap-1 shrink-0">
                    <Zap className="w-3 h-3 text-indigo-500" />
                    Wokwi Rig Ready
                  </span>
                )}
              </div>

              {/* Description & Technical Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {selectedItem.specifications}
              </p>

              {/* Detailed Electrical & Mechanical Property Matrix */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Operating Voltage</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-[#EADCC9]">{selectedItem.operatingVoltage || '3.3V / 5.0V DC'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Bus Protocol</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{selectedItem.busProtocol || 'Standard Digital/Analog'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Current Consumption</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">{selectedItem.currentDraw || '20mA'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Dimensions & Weight</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">{selectedItem.dimensions || '—'} · {selectedItem.weight || '—'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Package / Form Factor</span>
                  <span className="font-sans text-slate-800 dark:text-slate-200">{selectedItem.packageType || 'Standard Module'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Tolerance / Precision</span>
                  <span className="font-sans text-slate-800 dark:text-slate-200">{selectedItem.tolerance || 'Industrial Grade'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#142136]">
                  <span className="text-slate-500 dark:text-slate-400 font-tech uppercase text-[11px] tracking-wide">Storage Location</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedItem.location}
                  </span>
                </div>
              </div>

              {/* Pinout Specifications with Click-to-Copy */}
              {selectedItem.pinout && selectedItem.pinout.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[11px] font-tech uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">
                    <span>Hardware Pinout Mapping (Click to copy):</span>
                    {copiedPin && (
                      <span className="text-[#849B74] font-bold flex items-center gap-1 text-[10px]">
                        <Check className="w-3 h-3" /> Copied {copiedPin}!
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.pinout.map((pin, i) => {
                      const isPinCopied = copiedPin === pin;
                      return (
                        <button
                          key={i}
                          onClick={() => handleCopyPin(pin)}
                          title="Click to copy pin assignment"
                          className={`px-2 py-1 rounded border text-[10px] font-mono cursor-pointer transition-all flex items-center gap-1 ${
                            isPinCopied
                              ? 'bg-[#849B74]/20 border-[#849B74] text-[#849B74] font-bold'
                              : 'bg-slate-100 dark:bg-[#070B14] border-slate-200 dark:border-[#1A263C] text-slate-700 dark:text-[#82B2D8] hover:border-[#82B2D8]'
                          }`}
                        >
                          <span>{pin}</span>
                          {isPinCopied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5 opacity-50" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons: Manifest Copy & Live Simulator */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleCopyManifest(selectedItem)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#142136] dark:hover:bg-[#1A2A44] border border-slate-200 dark:border-[#1E2D4A] text-slate-800 dark:text-slate-200 text-xs font-tech uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedManifest ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#849B74]" />
                      <span className="text-[#849B74]">JSON Manifest Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Hardware JSON Manifest</span>
                    </>
                  )}
                </button>

                {selectedItem.simulatorCompatible && onNavigateToSimulator && (
                  <button
                    onClick={onNavigateToSimulator}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 text-xs font-tech uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span>Test {selectedItem.name.split(' ')[0]} in Wokwi Live Rig</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white dark:bg-[#0D1422] rounded-xl border border-slate-200 dark:border-[#162238] font-sans">
              Select a component to inspect electrical properties, bus protocols, and pinouts.
            </div>
          )}
        </div>

      </div>

      {/* Register Component Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#1E2D4A] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-[#162238]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Register Component with Properties</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Component Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VL53L1X Time-of-Flight Laser Sensor"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">SKU / Serial</label>
                  <input
                    type="text"
                    placeholder="e.g. SNS-TOF-01"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ComponentCategory)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Operating Voltage</label>
                  <input
                    type="text"
                    value={formVoltage}
                    onChange={(e) => setFormVoltage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Bus Protocol</label>
                  <input
                    type="text"
                    value={formBus}
                    onChange={(e) => setFormBus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Current Draw</label>
                  <input
                    type="text"
                    value={formCurrent}
                    onChange={(e) => setFormCurrent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Price ($)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Hardware Pinouts (comma separated)</label>
                <input
                  type="text"
                  value={formPinout}
                  onChange={(e) => setFormPinout(e.target.value)}
                  placeholder="VCC, GND, SDA, SCL, INT"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="Accuracy, optical return range, operating temperature..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-[#070B14] font-bold text-xs rounded-lg transition-colors cursor-pointer mt-4"
              >
                Save Component into Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
