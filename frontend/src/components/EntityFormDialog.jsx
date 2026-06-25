import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

/**
 * Generic create/edit dialog.
 * fields: [{ name, label, type: 'text'|'select', options?: string[], required?: bool, placeholder? }]
 */
export const EntityFormDialog = ({ open, onClose, onSubmit, fields, initialData, title, description }) => {
  const buildState = () => {
    const base = {};
    fields.forEach((f) => {
      base[f.name] = initialData?.[f.name] ?? f.default ?? '';
    });
    return base;
  };

  const [form, setForm] = useState(buildState());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(buildState());
    // eslint-disable-next-line
  }, [open, initialData]);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      /* error toast handled by caller */
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-dark border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="entity-form-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading font-bold text-xl uppercase tracking-wide">{title}</DialogTitle>
          {description && <DialogDescription className="text-zinc-500">{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                <Label className="overline block mb-1.5">{field.label}</Label>
                {field.type === 'select' ? (
                  <Select value={form[field.name]} onValueChange={(v) => handleChange(field.name, v)}>
                    <SelectTrigger className="input-obsidian" data-testid={`field-${field.name}`}>
                      <SelectValue placeholder={field.placeholder || 'Selecione...'} />
                    </SelectTrigger>
                    <SelectContent className="bg-sony-paper border-white/10 text-white">
                      {field.options.map((opt) => (
                        <SelectItem key={opt} value={opt} className="text-zinc-300 focus:bg-white/5 focus:text-white">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={field.type || 'text'}
                    className="input-obsidian"
                    placeholder={field.placeholder}
                    required={field.required}
                    value={form[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    data-testid={`field-${field.name}`}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" className="btn-sony-outline" onClick={onClose} data-testid="form-cancel-btn">
              Cancelar
            </Button>
            <Button type="submit" className="btn-sony" disabled={saving} data-testid="form-save-btn">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
