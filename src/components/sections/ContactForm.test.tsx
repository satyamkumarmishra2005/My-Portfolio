import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    form: ({ children, ...props }: React.PropsWithChildren<object>) => <form {...props}>{children}</form>,
    p: ({ children, ...props }: React.PropsWithChildren<object>) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  },
}));

// Mock the useReducedMotion hook
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('ContactForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('renders all form fields', () => {
      render(<ContactForm />);
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<ContactForm />);
      
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('has proper aria-label for the form', () => {
      render(<ContactForm />);
      
      expect(screen.getByRole('form', { name: /contact form/i })).toBeInTheDocument();
    });

    it('renders input placeholders', () => {
      render(<ContactForm />);
      
      // Updated placeholders to match new UI
      expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tell me about your project/i)).toBeInTheDocument();
    });
  });

  describe('Validation Display', () => {
    it('shows name error when name is too short on blur', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText('Name');
      await user.type(nameInput, 'A');
      await user.tab(); // Trigger blur
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('shows email error for invalid email on blur', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('shows message error when message is too short on blur', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const messageInput = screen.getByLabelText('Message');
      await user.type(messageInput, 'Short');
      await user.tab(); // Trigger blur
      
      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('shows all validation errors on submit with empty form', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    it('clears error when user starts typing valid input', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      // First trigger the error
      const nameInput = screen.getByLabelText('Name');
      await user.type(nameInput, 'A');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
      
      // Now type more to clear the error
      await user.click(nameInput);
      await user.type(nameInput, 'lice');
      
      await waitFor(() => {
        expect(screen.queryByText(/name must be at least 2 characters/i)).not.toBeInTheDocument();
      });
    });

    it('sets aria-invalid on invalid fields', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      
      const nameInput = screen.getByLabelText('Name');
      await user.type(nameInput, 'A');
      await user.tab();
      
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data when valid', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'This is a test message that is long enough.');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message that is long enough.',
        });
      });
    });

    it('does not call onSubmit when form is invalid', async () => {
      const mockOnSubmit = vi.fn();
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows success message after successful submission', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'This is a test message that is long enough.');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        // Updated success message to match new UI
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });

    it('shows error message when submission fails', async () => {
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'This is a test message that is long enough.');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });

    it('disables form fields during submission', async () => {
      const mockOnSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'This is a test message that is long enough.');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      // Check that fields are disabled during submission
      expect(screen.getByLabelText('Name')).toBeDisabled();
      expect(screen.getByLabelText('Email')).toBeDisabled();
      expect(screen.getByLabelText('Message')).toBeDisabled();
    });

    it('resets form after successful submission', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Message'), 'This is a test message that is long enough.');
      
      await user.click(screen.getByRole('button', { name: /send message/i }));
      
      await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(screen.getByLabelText('Email')).toHaveValue('');
        expect(screen.getByLabelText('Message')).toHaveValue('');
      });
    });
  });
});
