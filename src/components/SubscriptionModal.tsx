import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const plans = [
    { name: 'Starter', price: 'Free', features: ['Basic AI responses', 'Daily limit: 10 messages'] },
    { name: 'Pro', price: '$9/mo', features: ['Advanced AI model', 'Unlimited messages', 'Priority support', 'Early access features'] },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-natural-text/20 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-natural-border relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-natural-muted hover:text-natural-text">
              <X size={24} />
            </button>

            <h2 className="text-3xl font-serif text-natural-text mb-2 text-center">Upgrade Aura AI</h2>
            <p className="text-natural-muted mb-8 text-center">Choose the plan that fits you best.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className="border border-natural-border rounded-2xl p-6 hover:border-natural-accent transition-colors">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-serif mb-6">{plan.price}</div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-natural-muted">
                        <Check size={16} className="text-natural-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 rounded-full bg-natural-text text-white hover:bg-natural-accent transition-colors">
                    {plan.price === 'Free' ? 'Current Plan' : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
