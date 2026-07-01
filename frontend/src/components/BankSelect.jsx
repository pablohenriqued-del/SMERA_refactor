import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BANKS } from '../lib/banks';

export const BankSelect = ({ value, onChange, testid }) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger className="input-obsidian" data-testid={testid}>
      <SelectValue placeholder="Selecione o banco" />
    </SelectTrigger>
    <SelectContent className="bg-sony-paper border-white/10 text-white max-h-72">
      {BANKS.map((b) => (
        <SelectItem key={b} value={b} className="text-zinc-300 focus:bg-white/5 focus:text-white">{b}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);
