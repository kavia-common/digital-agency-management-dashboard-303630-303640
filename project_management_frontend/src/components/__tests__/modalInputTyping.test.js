import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';
import InputField from '../InputField';

function TestModalWithInput() {
  const [value, setValue] = React.useState('');
  return (
    <Modal open ariaLabel="Test modal" onClose={() => {}}>
      <div>
        <InputField
          label="Name"
          name="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </Modal>
  );
}

describe('Modal + InputField typing regression', () => {
  test('allows typing multiple characters without truncation', async () => {
    const user = userEvent.setup();
    render(<TestModalWithInput />);

    const input = screen.getByLabelText('Name');
    await user.click(input);
    await user.type(input, 'hello world');

    expect(input).toHaveValue('hello world');
  });
});
