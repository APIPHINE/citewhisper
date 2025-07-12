
import { UseFormReturn } from 'react-hook-form';
import { LayeredQuoteForm } from './LayeredQuoteForm';
import type { QuoteFormValues } from '@/utils/formSchemas';

interface QuoteFormFieldsProps {
  form: UseFormReturn<QuoteFormValues>;
}

export function QuoteFormFields({ form }: QuoteFormFieldsProps) {
  return <LayeredQuoteForm form={form} />;
}
