import { render } from '@testing-library/react';
import React from 'react';

import Button from '../../components/Button';

describe('Button component', () => {
  it('should be able to render a button', () => {
    const { getByText } = render(<Button>Botão</Button>);

    expect(getByText('Botão')).toBeTruthy();
  });

  it('should be able to show "Carregando..." when it is loading', () => {
    const { getByTestId } = render(
      <Button data-testid="buttonid" loading>
        Botão
      </Button>,
    );

    expect(getByTestId('buttonid')).toContainHTML('Carregando...');
  });
});
