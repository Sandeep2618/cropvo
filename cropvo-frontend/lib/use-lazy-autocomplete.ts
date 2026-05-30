import { useCallback, useState } from 'react';

/**
 * Blocks browser autofill on page load. After the user focuses or clicks the
 * field, autocomplete / saved-credential suggestions work as usual.
 */
export function useLazyAutocomplete() {
  const [enabled, setEnabled] = useState(false);
  const enable = useCallback(() => setEnabled(true), []);

  return {
    readOnly: !enabled,
    onFocus: enable,
    onClick: enable,
  };
}
