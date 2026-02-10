"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XIcon, PlusIcon, TrashIcon, MoveUpIcon, MoveDownIcon, MoveLeftIcon, MoveRightIcon, Pipette } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ElementData {
  elementId?: number;
  tag: string;
  id: string;
  classList: string[];
  textContent: string;
  innerHTML: string;
  attributes: Record<string, string>;
  styles: Record<string, string>;
  path: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

interface Props {
  selectedElement: ElementData | null;
  onUpdate: (updates: Partial<ElementData>) => void;
  onClose?: () => void;
}

// Tailwind Color Palette
const TAILWIND_COLORS = {
  slate: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
  gray: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'],
  zinc: ['#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b'],
  neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717'],
  stone: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917'],
  red: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
  orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
  amber: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  yellow: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12'],
  lime: ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314'],
  green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  emerald: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  teal: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
  cyan: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
  sky: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
  blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  indigo: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
  violet: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
  purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  fuchsia: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75'],
  pink: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'],
  rose: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'],
};

const COLOR_NAMES = Object.keys(TAILWIND_COLORS);

const COMMON_COLORS = [
  '#ffffff', '#000000', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af',
  '#6b7280', '#374151', '#1f2937', '#111827',
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
  '#10b981', '#059669', '#047857', '#065f46',
  '#f59e0b', '#d97706', '#b45309', '#92400e',
  '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
  const [showPalette, setShowPalette] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState('common');

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div
            className="w-12 h-9 rounded border cursor-pointer flex items-center justify-center hover:ring-2 ring-primary transition-all"
            style={{ backgroundColor: value || '#ffffff' }}
            onClick={() => setShowPalette(!showPalette)}
          >
            <Pipette className="h-4 w-4 text-white mix-blend-difference" />
          </div>
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="inherit"
            className="text-xs flex-1 font-mono"
          />
        </div>

        {showPalette && (
          <div className="border rounded-lg p-3 bg-background shadow-lg space-y-3">
            <div className="flex gap-1 overflow-x-auto pb-2">
              <Button
                size="sm"
                variant={selectedPalette === 'common' ? 'default' : 'outline'}
                onClick={() => setSelectedPalette('common')}
                className="text-xs whitespace-nowrap"
              >
                Common
              </Button>
              {COLOR_NAMES.slice(0, 8).map((colorName) => (
                <Button
                  key={colorName}
                  size="sm"
                  variant={selectedPalette === colorName ? 'default' : 'outline'}
                  onClick={() => setSelectedPalette(colorName)}
                  className="text-xs capitalize whitespace-nowrap"
                >
                  {colorName}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-10 gap-1.5">
              {selectedPalette === 'common' ? (
                COMMON_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded border-2 hover:scale-110 transition-transform",
                      value === color ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setShowPalette(false);
                    }}
                    title={color}
                  />
                ))
              ) : (
                TAILWIND_COLORS[selectedPalette as keyof typeof TAILWIND_COLORS]?.map((color, idx) => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded border hover:scale-110 transition-transform",
                      value === color ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setShowPalette(false);
                    }}
                    title={`${selectedPalette}-${idx * 100}`}
                  />
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Input
                type="color"
                value={value || '#ffffff'}
                onChange={(e) => onChange(e.target.value)}
                className="w-20 h-8 p-1 cursor-pointer"
              />
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="text-xs flex-1 font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ElementInspector = ({
  selectedElement,
  onUpdate,
  onClose,
}: Props) => {
  const [localElement, setLocalElement] = useState<ElementData | null>(null);
  const [newClassName, setNewClassName] = useState("");
  const [newAttrName, setNewAttrName] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  useEffect(() => {
    setLocalElement(selectedElement);
  }, [selectedElement]);

  if (!localElement) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-4 text-sm text-center">
        Click on an element in the preview to inspect and edit it
      </div>
    );
  }

  const updateTextContent = (value: string) => {
    setLocalElement({ ...localElement, textContent: value });
    onUpdate({ textContent: value });
  };

  const updateId = (value: string) => {
    setLocalElement({ ...localElement, id: value });
    onUpdate({ id: value });
  };

  const addClass = () => {
    if (!newClassName.trim()) return;
    const updatedClasses = [...localElement.classList, newClassName.trim()];
    setLocalElement({ ...localElement, classList: updatedClasses });
    onUpdate({ classList: updatedClasses });
    setNewClassName("");
  };

  const removeClass = (className: string) => {
    const updatedClasses = localElement.classList.filter((c) => c !== className);
    setLocalElement({ ...localElement, classList: updatedClasses });
    onUpdate({ classList: updatedClasses });
  };

  const addAttribute = () => {
    if (!newAttrName.trim()) return;
    const updatedAttrs = {
      ...localElement.attributes,
      [newAttrName.trim()]: newAttrValue.trim(),
    };
    setLocalElement({ ...localElement, attributes: updatedAttrs });
    onUpdate({ attributes: updatedAttrs });
    setNewAttrName("");
    setNewAttrValue("");
  };

  const removeAttribute = (attrName: string) => {
    const updatedAttrs = { ...localElement.attributes };
    delete updatedAttrs[attrName];
    setLocalElement({ ...localElement, attributes: updatedAttrs });
    onUpdate({ attributes: updatedAttrs });
  };

  const updateAttribute = (name: string, value: string) => {
    const updatedAttrs = { ...localElement.attributes, [name]: value };
    setLocalElement({ ...localElement, attributes: updatedAttrs });
    onUpdate({ attributes: updatedAttrs });
  };

  const updateStyle = (property: string, value: string) => {
    const updatedStyles = { ...localElement.styles, [property]: value };
    setLocalElement({ ...localElement, styles: updatedStyles });
    onUpdate({ styles: updatedStyles });
  };

  const getStyleValue = (property: string, defaultValue = "") => {
    return localElement.styles[property] || defaultValue;
  };

  const parseSpacing = (value: string) => {
    return parseInt(value) || 0;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-3 border-b flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">Visual Editor</div>
          <div className="text-xs text-muted-foreground truncate font-mono">
            {localElement.tag}
            {localElement.id && `#${localElement.id}`}
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="px-3 py-2 bg-muted/30 border-b">
        <div className="text-xs text-muted-foreground font-mono break-all">
          {localElement.path}
        </div>
      </div>

      <Tabs defaultValue="design" className="w-full flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b h-9 bg-muted/20 flex-shrink-0">
          <TabsTrigger value="design" className="text-xs data-[state=active]:bg-background">
            Design
          </TabsTrigger>
          <TabsTrigger value="layout" className="text-xs data-[state=active]:bg-background">
            Layout
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs data-[state=active]:bg-background">
            Properties
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 h-full">

          {/* DESIGN TAB */}
          <TabsContent value="design" className="p-4 space-y-6">
            {/* Colors Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colors</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
              </div>

              <div className="grid gap-4">
                <ColorPicker
                  label="Text color"
                  value={getStyleValue("color")}
                  onChange={(color) => updateStyle("color", color)}
                />

                <ColorPicker
                  label="Background"
                  value={getStyleValue("backgroundColor")}
                  onChange={(color) => updateStyle("backgroundColor", color)}
                />

                <ColorPicker
                  label="Border color"
                  value={getStyleValue("borderColor")}
                  onChange={(color) => updateStyle("borderColor", color)}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Spacing Section with Visual Box Model */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spacing</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
              </div>

              {/* Visual Box Model */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold mb-2">MARGIN</div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 p-4 rounded border border-green-200 dark:border-green-800">
                  <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold mb-2">PADDING</div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800 text-center">
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">CONTENT</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.round(localElement.rect.width)} × {Math.round(localElement.rect.height)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Margin Controls */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground font-semibold">Margin</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("marginTop"))}
                        onChange={(e) => updateStyle("marginTop", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-orange-50/50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-800 focus:ring-orange-500"
                      />
                      <MoveUpIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Top</div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("marginRight"))}
                        onChange={(e) => updateStyle("marginRight", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-orange-50/50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-800 focus:ring-orange-500"
                      />
                      <MoveRightIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Right</div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("marginBottom"))}
                        onChange={(e) => updateStyle("marginBottom", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-orange-50/50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-800 focus:ring-orange-500"
                      />
                      <MoveDownIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Bottom</div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("marginLeft"))}
                        onChange={(e) => updateStyle("marginLeft", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-orange-50/50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-800 focus:ring-orange-500"
                      />
                      <MoveLeftIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Left</div>
                  </div>
                </div>
              </div>

              {/* Padding Controls */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground font-semibold">Padding</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("paddingTop"))}
                        onChange={(e) => updateStyle("paddingTop", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800 focus:ring-green-500"
                      />
                      <MoveUpIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Top</div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("paddingRight"))}
                        onChange={(e) => updateStyle("paddingRight", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800 focus:ring-green-500"
                      />
                      <MoveRightIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Right</div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("paddingBottom"))}
                        onChange={(e) => updateStyle("paddingBottom", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800 focus:ring-green-500"
                      />
                      <MoveDownIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Bottom</div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input
                        type="number"
                        value={parseSpacing(getStyleValue("paddingLeft"))}
                        onChange={(e) => updateStyle("paddingLeft", e.target.value + "px")}
                        placeholder="0"
                        className="text-xs pl-7 h-9 bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800 focus:ring-green-500"
                      />
                      <MoveLeftIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-[10px] text-center text-muted-foreground">Left</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Typography Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Typography</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Font size</Label>
                  <Select
                    value={getStyleValue("fontSize")}
                    onValueChange={(value) => updateStyle("fontSize", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12px">12px (xs)</SelectItem>
                      <SelectItem value="14px">14px (sm)</SelectItem>
                      <SelectItem value="16px">16px (base)</SelectItem>
                      <SelectItem value="18px">18px (lg)</SelectItem>
                      <SelectItem value="20px">20px (xl)</SelectItem>
                      <SelectItem value="24px">24px (2xl)</SelectItem>
                      <SelectItem value="30px">30px (3xl)</SelectItem>
                      <SelectItem value="36px">36px (4xl)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Font weight</Label>
                  <Select
                    value={getStyleValue("fontWeight")}
                    onValueChange={(value) => updateStyle("fontWeight", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light</SelectItem>
                      <SelectItem value="400">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                      <SelectItem value="800">Extra Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Text align</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['left', 'center', 'right', 'justify'].map((align) => (
                    <Button
                      key={align}
                      size="sm"
                      variant={getStyleValue("textAlign") === align ? "default" : "outline"}
                      onClick={() => updateStyle("textAlign", align)}
                      className="text-xs capitalize h-9"
                    >
                      {align}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Border & Effects Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Border & Effects</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Border width</Label>
                  <Select
                    value={getStyleValue("borderWidth")}
                    onValueChange={(value) => updateStyle("borderWidth", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="1px">1px</SelectItem>
                      <SelectItem value="2px">2px</SelectItem>
                      <SelectItem value="3px">3px</SelectItem>
                      <SelectItem value="4px">4px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Border style</Label>
                  <Select
                    value={getStyleValue("borderStyle")}
                    onValueChange={(value) => updateStyle("borderStyle", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Border radius</Label>
                  <Select
                    value={getStyleValue("borderRadius")}
                    onValueChange={(value) => updateStyle("borderRadius", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      <SelectItem value="4px">SM</SelectItem>
                      <SelectItem value="8px">MD</SelectItem>
                      <SelectItem value="12px">LG</SelectItem>
                      <SelectItem value="16px">XL</SelectItem>
                      <SelectItem value="9999px">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Shadow</Label>
                  <Select
                    value={getStyleValue("boxShadow")}
                    onValueChange={(value) => updateStyle("boxShadow", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Shadow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="0 1px 2px 0 rgb(0 0 0 / 0.05)">SM</SelectItem>
                      <SelectItem value="0 4px 6px -1px rgb(0 0 0 / 0.1)">MD</SelectItem>
                      <SelectItem value="0 10px 15px -3px rgb(0 0 0 / 0.1)">LG</SelectItem>
                      <SelectItem value="0 20px 25px -5px rgb(0 0 0 / 0.1)">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={parseFloat(getStyleValue("opacity", "1")) * 100}
                    onChange={(e) => updateStyle("opacity", (parseInt(e.target.value) / 100).toString())}
                    className="flex-1"
                  />
                  <span className="text-xs font-mono w-12 text-right">
                    {Math.round(parseFloat(getStyleValue("opacity", "1")) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* LAYOUT TAB */}
          <TabsContent value="layout" className="p-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layout</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Display</Label>
                  <Select
                    value={getStyleValue("display")}
                    onValueChange={(value) => updateStyle("display", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Display" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block">Block</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="inline-block">Inline Block</SelectItem>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <Select
                    value={getStyleValue("position")}
                    onValueChange={(value) => updateStyle("position", value)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                      <SelectItem value="absolute">Absolute</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="sticky">Sticky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <Input
                    value={getStyleValue("width")}
                    onChange={(e) => updateStyle("width", e.target.value)}
                    placeholder="auto"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Height</Label>
                  <Input
                    value={getStyleValue("height")}
                    onChange={(e) => updateStyle("height", e.target.value)}
                    placeholder="auto"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* Flexbox Controls */}
            {getStyleValue("display") === "flex" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flexbox</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-border via-transparent to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Direction</Label>
                      <Select
                        value={getStyleValue("flexDirection")}
                        onValueChange={(value) => updateStyle("flexDirection", value)}
                      >
                        <SelectTrigger className="text-xs h-9">
                          <SelectValue placeholder="Direction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="row">Row</SelectItem>
                          <SelectItem value="column">Column</SelectItem>
                          <SelectItem value="row-reverse">Row Reverse</SelectItem>
                          <SelectItem value="column-reverse">Column Reverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Wrap</Label>
                      <Select
                        value={getStyleValue("flexWrap")}
                        onValueChange={(value) => updateStyle("flexWrap", value)}
                      >
                        <SelectTrigger className="text-xs h-9">
                          <SelectValue placeholder="Wrap" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nowrap">No Wrap</SelectItem>
                          <SelectItem value="wrap">Wrap</SelectItem>
                          <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Justify</Label>
                      <Select
                        value={getStyleValue("justifyContent")}
                        onValueChange={(value) => updateStyle("justifyContent", value)}
                      >
                        <SelectTrigger className="text-xs h-9">
                          <SelectValue placeholder="Justify" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flex-start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="flex-end">End</SelectItem>
                          <SelectItem value="space-between">Space Between</SelectItem>
                          <SelectItem value="space-around">Space Around</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Align</Label>
                      <Select
                        value={getStyleValue("alignItems")}
                        onValueChange={(value) => updateStyle("alignItems", value)}
                      >
                        <SelectTrigger className="text-xs h-9">
                          <SelectValue placeholder="Align" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flex-start">Start</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="flex-end">End</SelectItem>
                          <SelectItem value="stretch">Stretch</SelectItem>
                          <SelectItem value="baseline">Baseline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Gap</Label>
                    <Input
                      value={getStyleValue("gap")}
                      onChange={(e) => updateStyle("gap", e.target.value)}
                      placeholder="0px"
                      className="text-xs h-9"
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties" className="p-4 space-y-4">
            {/* Text Content */}
            {localElement.textContent && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Text Content</Label>
                <Input
                  value={localElement.textContent}
                  onChange={(e) => updateTextContent(e.target.value)}
                  className="text-xs h-9"
                  placeholder="Element text"
                />
              </div>
            )}

            {/* ID */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">ID</Label>
              <Input
                value={localElement.id}
                onChange={(e) => updateId(e.target.value)}
                className="text-xs font-mono h-9"
                placeholder="element-id"
              />
            </div>

            {/* Classes */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Classes</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {localElement.classList.map((className, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs font-mono flex items-center gap-1 px-2 py-1"
                  >
                    {className}
                    <button
                      onClick={() => removeClass(className)}
                      className="hover:text-destructive ml-1"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addClass()}
                  className="text-xs font-mono h-9"
                  placeholder="new-class"
                />
                <Button size="sm" onClick={addClass} variant="outline" className="h-9">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Attributes */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Attributes</Label>
              <div className="space-y-2">
                {Object.entries(localElement.attributes)
                  .filter(([name]) => name !== "class" && name !== "id" && name !== "style")
                  .map(([name, value]) => (
                    <div key={name} className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          value={name}
                          disabled
                          className="text-xs font-mono bg-muted h-9"
                        />
                        <Input
                          value={value}
                          onChange={(e) => updateAttribute(name, e.target.value)}
                          className="text-xs font-mono h-9"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAttribute(name)}
                        className="h-9"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={newAttrName}
                    onChange={(e) => setNewAttrName(e.target.value)}
                    className="text-xs font-mono h-9"
                    placeholder="attribute"
                  />
                  <Input
                    value={newAttrValue}
                    onChange={(e) => setNewAttrValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAttribute()}
                    className="text-xs font-mono h-9"
                    placeholder="value"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={addAttribute}
                  variant="outline"
                  className="w-full h-9"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Attribute
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};
