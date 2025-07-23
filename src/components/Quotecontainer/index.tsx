import { Quote as QuoteIcon, Sparkles, RefreshCw } from 'lucide-react';

interface QuoteData {
  quote: string;
  author: string;
}

interface QuoteContainerProps {
  quote?: QuoteData | null;
  loading?: boolean;
  error?: boolean;
}

export default function QuoteContainer({ quote, loading = false, error = false }: QuoteContainerProps) {
  // Quote padrão para fallback
  const defaultQuote: QuoteData = {
    quote: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Robert Collier"
  };

  // Usar quote da API se disponível, senão usar a padrão
  const displayQuote = quote || defaultQuote;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <QuoteIcon className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles
              size={18}
              className="text-yellow-500 dark:text-yellow-400"
            />
            Citação do Dia
          </h3>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ) : error ? (
            <div className="space-y-3">
              <blockquote className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                &quot{defaultQuote.quote}&quot
              </blockquote>
              <cite className="text-sm text-gray-500 dark:text-gray-400 font-medium not-italic">
                — {defaultQuote.author}
              </cite>
              <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-2">
                ⚠️ Usando citação padrão (erro ao carregar da API)
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <blockquote className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{displayQuote.quote}"
              </blockquote>
              <cite className="text-sm text-gray-500 dark:text-gray-400 font-medium not-italic">
                — {displayQuote.author}
              </cite>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <RefreshCw size={12} />
              {quote && !error ? 'Carregada da API' : 'Citação padrão'} •
              Renovada diariamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
