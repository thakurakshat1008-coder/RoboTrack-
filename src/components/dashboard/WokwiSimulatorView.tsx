import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Cpu, 
  Terminal, 
  Radio, 
  Zap, 
  Layers, 
  FileCode2, 
  Maximize2, 
  CheckCircle2, 
  Volume2, 
  Activity,
  Bot
} from 'lucide-react';

interface PresetCode {
  id: string;
  title: string;
  board: string;
  description: string;
  code: string;
}

const PRESET_CODES: PresetCode[] = [
  {
    id: 'obstacle-evade',
    title: 'Autonomous Obstacle Evasion Routine',
    board: 'ESP32-S3 DevKit',
    description: 'HC-SR04 ultrasonic rangefinder scans forward. If distance < 20cm, SG90 servo sweeps steering and OLED alerts.',
    code: `// RoboTrack Embedded Autonomous Rover Node
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <ESP32Servo.h>

#define TRIG_PIN 5
#define ECHO_PIN 18
#define SERVO_PIN 13
#define BUZZER_PIN 14

Servo steeringServo;
Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  steeringServo.attach(SERVO_PIN);
  steeringServo.write(90); // Center heading
  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.println("ROBOTRACK ARES-IV");
  display.println("NODE READY: 115200");
  display.display();
  Serial.println("[SYSTEM] Sub-millisecond ROS2 node initialized.");
}

void loop() {
  // Trigger ultrasonic pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = duration * 0.034 / 2;
  
  Serial.printf("[TELEMETRY] Range: %.1f cm | Heading: %d deg\\n", distanceCm, steeringServo.read());
  
  if (distanceCm < 20.0 && distanceCm > 0) {
    // Evasive maneuver: Turn 45 deg right
    steeringServo.write(135);
    tone(BUZZER_PIN, 1800, 100);
  } else {
    steeringServo.write(90); // Straight
  }
  delay(150);
}`
  },
  {
    id: 'servo-adc',
    title: 'Kinematic Potentiometer Arm Tracker',
    board: 'Arduino Uno R4 WiFi',
    description: 'Analog potentiometer input mapped to 180-degree servo articulation with real-time serial feedback.',
    code: `// RoboTrack Kinematic Joint Tracking Node
#include <Servo.h>

const int potPin = A0;
const int servoPin = 9;
Servo jointServo;

void setup() {
  Serial.begin(115200);
  jointServo.attach(servoPin);
  Serial.println("[KINEMATICS] Joint angle tracking calibrated.");
}

void loop() {
  int potValue = analogRead(potPin); // 0 - 1023
  int angle = map(potValue, 0, 1023, 0, 180);
  jointServo.write(angle);
  
  Serial.print("POT_ADC: "); Serial.print(potValue);
  Serial.print(" -> JOINT_ANGLE: "); Serial.print(angle);
  Serial.println(" deg");
  delay(100);
}`
  },
  {
    id: 'neopixel-radar',
    title: 'LiDAR Proximity Neopixel Radar Ring',
    board: 'ESP32-S3 DevKit',
    description: '16-LED WS2812B ring transitions from Green to Amber to Red based on obstacle proximity.',
    code: `// RoboTrack 16-LED Neopixel Distance Radar
#include <Adafruit_NeoPixel.h>

#define LED_PIN 4
#define NUM_LEDS 16
Adafruit_NeoPixel ring(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  ring.begin();
  ring.show(); // Clear
  Serial.println("[RADAR] 16-LED Circular Indicator online.");
}

void loop() {
  // Color ramp based on simulated proximity
  for(int i = 0; i < NUM_LEDS; i++) {
    ring.setPixelColor(i, ring.Color(0, 220, 255));
  }
  ring.show();
  delay(500);
}`
  }
];

export const WokwiSimulatorView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetCode>(PRESET_CODES[0]);
  const [isRunning, setIsRunning] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [selectedBoard, setSelectedBoard] = useState('ESP32-S3 DevKit');
  
  // Interactive Breadboard Hardware State
  const [ultrasonicDistance, setUltrasonicDistance] = useState(28); // cm
  const [potentiometerValue, setPotentiometerValue] = useState(512); // 0 - 1023
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [servoAngle, setServoAngle] = useState(90); // 0 - 180 deg
  const [buzzerActive, setBuzzerActive] = useState(false);
  
  // Serial Monitor Output Lines
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[BOOT] RoboTrack Embedded Simulation Engine v2.4 initialized.',
    '[WOKWI-SIM] Mounting virtual peripheral bus: I2C (0x3C), PWM (GPIO13), ADC (GPIO34)...',
    '[OK] Virtual ESP32-S3 running at 240 MHz clock.'
  ]);
  const serialEndRef = useRef<HTMLDivElement>(null);

  // Auto-run simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Compute servo angle based on distance or potentiometer
      let targetServo = 90;
      let buzzerState = false;

      if (selectedPreset.id === 'servo-adc') {
        targetServo = Math.round((potentiometerValue / 1023) * 180);
      } else {
        if (ultrasonicDistance < 20) {
          targetServo = 135;
          buzzerState = true;
        } else {
          targetServo = 90;
          buzzerState = false;
        }
      }

      setServoAngle(targetServo);
      setBuzzerActive(buzzerState);

      // Append serial output
      const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLog = `[${timeStr}] DIST: ${ultrasonicDistance.toFixed(1)}cm | POT: ${potentiometerValue} | SERVO: ${targetServo}° | BUZZ: ${buzzerState ? 'ALERT' : 'OFF'}`;
      
      setSerialLogs(prev => [...prev.slice(-40), newLog]);
    }, 500 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed, ultrasonicDistance, potentiometerValue, selectedPreset.id]);

  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [serialLogs]);

  // Reset simulator state
  const handleReset = () => {
    setUltrasonicDistance(28);
    setPotentiometerValue(512);
    setServoAngle(90);
    setBuzzerActive(false);
    setSerialLogs(prev => [...prev, '[RESET] Core MCU reset triggered. Registers cleared.']);
  };

  // Neopixel color computation based on distance
  const getNeopixelColor = (index: number) => {
    if (buzzerActive) {
      return index % 2 === 0 ? '#EF4444' : '#F59E0B'; // Flashing Red/Amber alert
    }
    if (ultrasonicDistance < 35) {
      return '#F59E0B'; // Amber caution
    }
    return '#00E5FF'; // Nominal laser cyan
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#142136]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Live Robotics Circuit & Microcontroller Simulator
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40">
              WOKWI-CORE ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8996AA]">
            Interactive browser-based microcontroller rig. Test firmware code, drag sensors, rotate servos, and inspect 128x64 OLED graphics in real time.
          </p>
        </div>

        {/* Global Simulator Controls */}
        <div className="flex items-center gap-2 self-start lg:self-auto text-xs">
          {/* Preset Project Selector */}
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = PRESET_CODES.find(x => x.id === e.target.value);
              if (p) setSelectedPreset(p);
            }}
            className="bg-white dark:bg-[#0D1422] border border-slate-300 dark:border-[#1E2D4A] rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 text-xs font-medium"
          >
            {PRESET_CODES.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {/* Run / Pause */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
              isRunning 
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300' 
                : 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Running' : 'Paused'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#0D1422] border border-slate-300 dark:border-[#1E2D4A] hover:border-cyan-500 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
            title="Reset Microcontroller"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0D1422] border border-slate-300 dark:border-[#1E2D4A] rounded-lg p-0.5 text-[11px] font-mono">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-2 py-0.5 rounded transition-colors ${simulationSpeed === spd ? 'bg-cyan-500 text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Simulator Stage: 2-Column Split (Canvas + Firmware Editor/Serial) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 cols): Interactive Breadboard & Peripheral Modules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-2xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-[#142136]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  TARGET: {selectedBoard}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Clock: 240 MHz · I2C Bus: 400kHz · PWM: 50Hz
              </span>
            </div>

            {/* Virtual Breadboard Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* MODULE 1: SSD1306 128x64 OLED Display */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-between text-center select-none shadow-inner">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                  <span>SSD1306 OLED (I2C: 0x3C)</span>
                  <span className="text-cyan-400 font-bold">128×64 PX</span>
                </div>

                {/* Pixel Screen Canvas */}
                <div className="w-44 h-24 bg-black border-2 border-slate-700 rounded-md p-2 flex flex-col justify-between font-mono text-cyan-300 text-[10px] shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
                  <div className="flex justify-between border-b border-cyan-500/30 pb-0.5">
                    <span className="font-bold">ROBOTRACK ARES</span>
                    <span>94%</span>
                  </div>
                  <div className="py-1">
                    <div>RANGE: {ultrasonicDistance.toFixed(1)} cm</div>
                    <div>SERVO: {servoAngle}°</div>
                    <div className="text-[9px] text-slate-400 truncate">
                      {ultrasonicDistance < 20 ? 'STATUS: EVADING RIGHT' : 'STATUS: PATH NOMINAL'}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${Math.min(100, (ultrasonicDistance / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500 mt-2">
                  Pins: VCC (3.3V) · GND · SCL (GPIO22) · SDA (GPIO21)
                </span>
              </div>

              {/* MODULE 2: HC-SR04 Ultrasonic Sensor with Draggable Obstacle Slider */}
              <div className="p-4 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">HC-SR04 Ultrasonic</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold tabular-nums">
                    {ultrasonicDistance} cm
                  </span>
                </div>

                {/* Sensor Transducers Visual */}
                <div className="flex items-center justify-center gap-3 my-2">
                  <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-slate-500 dark:bg-slate-900 border border-slate-400"></div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-slate-500 dark:bg-slate-900 border border-slate-400"></div>
                  </div>
                </div>

                {/* Interactive Slider for Distance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>2cm (Close)</span>
                    <span>100cm (Far)</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="100"
                    value={ultrasonicDistance}
                    onChange={(e) => setUltrasonicDistance(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-400 mt-2">
                  Pins: Trig (GPIO5) · Echo (GPIO18)
                </span>
              </div>

              {/* MODULE 3: SG90 Micro Servo 180° Rotating Arm */}
              <div className="p-4 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">SG90 Servo Motor</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                    {servoAngle}°
                  </span>
                </div>

                {/* Live Rotating Horn Gauge */}
                <div className="relative w-28 h-20 flex items-end justify-center overflow-hidden">
                  {/* Base Casing */}
                  <div className="w-20 h-10 bg-blue-700 rounded-t-lg relative border border-blue-600 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white uppercase tracking-tighter">TOWER PRO</span>
                    {/* Rotating Pivot */}
                    <div 
                      className="absolute -top-3 w-7 h-7 rounded-full bg-white border-2 border-slate-400 shadow-md flex items-center justify-center transition-transform duration-300"
                      style={{ transform: `rotate(${servoAngle - 90}deg)` }}
                    >
                      {/* Horn Arm */}
                      <div className="w-1.5 h-10 bg-slate-200 border border-slate-400 rounded-full absolute -top-5" />
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500 mt-2">
                  50Hz PWM Signal on GPIO13
                </div>
              </div>

              {/* MODULE 4: WS2812B 16-LED Neopixel Ring & Buzzer */}
              <div className="p-4 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">16-LED Ring & Buzzer</span>
                  {buzzerActive ? (
                    <span className="text-rose-500 font-bold animate-pulse flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> BEEPING
                    </span>
                  ) : (
                    <span className="text-slate-400">Silent</span>
                  )}
                </div>

                {/* Circular 16-LED Neopixel Array */}
                <div className="relative w-24 h-24 rounded-full border border-slate-300 dark:border-slate-800 flex items-center justify-center bg-slate-900 my-1">
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i * 360) / 16;
                    const rad = (angle * Math.PI) / 180;
                    const x = 38 * Math.cos(rad);
                    const y = 38 * Math.sin(rad);
                    const color = getNeopixelColor(i);

                    return (
                      <div
                        key={i}
                        className="absolute w-2.5 h-2.5 rounded-full transition-colors duration-300 shadow-sm"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}`
                        }}
                      />
                    );
                  })}
                  {/* Center Buzzer Icon */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                    buzzerActive 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-ping' 
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  WS2812B (GPIO4) · Buzzer (GPIO14)
                </div>
              </div>

              {/* MODULE 5: Analog Potentiometer Dial (ADC) */}
              <div className="p-4 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">10k Potentiometer (ADC)</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                    {potentiometerValue} / 1023 ({(potentiometerValue * 3.3 / 1023).toFixed(2)}V)
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1023"
                  value={potentiometerValue}
                  onChange={(e) => setPotentiometerValue(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer my-2"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0V (GND)</span>
                  <span>1.65V (Mid)</span>
                  <span>3.3V (VCC)</span>
                </div>
              </div>

              {/* MODULE 6: Tactile Pushbutton with Interrupt Indicator */}
              <div className="p-4 bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-[#1E2D4A] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">Tactile Pushbutton</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">GPIO 0 (Active LOW with Pullup)</div>
                </div>

                <button
                  onMouseDown={() => {
                    setIsButtonPressed(true);
                    setSerialLogs(prev => [...prev, '[INTERRUPT] Hardware INT on GPIO0: User Emergency Pause triggered.']);
                  }}
                  onMouseUp={() => setIsButtonPressed(false)}
                  onTouchStart={() => setIsButtonPressed(true)}
                  onTouchEnd={() => setIsButtonPressed(false)}
                  className={`w-12 h-12 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isButtonPressed 
                      ? 'bg-rose-500 text-white scale-95 shadow-inner' 
                      : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white'
                  }`}
                >
                  SW1
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Live Firmware Code & Serial Monitor Console */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Firmware Code Viewer / Editor */}
          <div className="p-4 bg-white dark:bg-[#0D1422] border border-slate-200 dark:border-[#162238] rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-[#142136]">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                  sketch.ino ({selectedPreset.board})
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                COMPILED & RUNNING
              </span>
            </div>

            <pre className="p-3 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-xl overflow-x-auto h-52 leading-relaxed border border-slate-800">
              <code>{selectedPreset.code}</code>
            </pre>
          </div>

          {/* Real-Time Serial Monitor (115200 baud) */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2 text-white">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">Serial Monitor (115200 baud)</span>
              </div>
              <button
                onClick={() => setSerialLogs([])}
                className="hover:text-white text-[11px] underline"
              >
                Clear
              </button>
            </div>

            {/* Console Output Screen */}
            <div className="h-44 overflow-y-auto font-mono text-[11px] text-emerald-400 space-y-1 p-2 bg-black/60 rounded-lg border border-slate-800/80">
              {serialLogs.map((log, i) => (
                <div key={i} className="leading-tight">{log}</div>
              ))}
              <div ref={serialEndRef} />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Send Serial command (e.g. GET_STATUS)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      setSerialLogs(prev => [...prev, `> ${target.value}`, `[ACK] Command '${target.value}' accepted.`]);
                      target.value = '';
                    }
                  }
                }}
                className="w-full px-2.5 py-1 bg-black/80 border border-slate-700 rounded text-[11px] font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
