import { useState } from 'react';

export function useEditableList(initial: string[]) {
  const [items, setItems] = useState(initial);
  const [errors, setErrors] = useState(initial.map(() => false));

  const add = () => {
    setItems(prev => [...prev, '']);
    setErrors(prev => [...prev, false]);
  };

  const update = (index: number, value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? value : item));
    if (value.trim()) setErrors(prev => prev.map((err, i) => i === index ? false : err));
  };

  const remove = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = items.map(item => !item.trim());
    setErrors(newErrors);
    return !newErrors.some(Boolean);
  };

  return { items, errors, add, update, remove, validate } as const;
}
