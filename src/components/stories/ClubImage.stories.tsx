// src/stories/ClubImage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedClubImage } from '@/components/clubs/EnhancedClubImage';

const meta: Meta<typeof EnhancedClubImage> = {
    title: 'Components/ClubImage',
    component: EnhancedClubImage,
    tags: ['autodocs'],
    argTypes: {
        priority: {
            control: 'boolean'
        }
    }
};

export default meta;
type Story = StoryObj<typeof EnhancedClubImage>;

export const Default: Story = {
    args: {
        src: '/sample-golf-course.jpg',
        alt: 'Golf Course'
    }
};

export const WithSanityImage: Story = {
    args: {
        src: {
            _type: 'image',
            asset: {
                _ref: 'image-123',
                _type: 'reference'
            }
        },
        alt: 'Sanity Golf Course'
    }
};

export const LoadingState: Story = {
    args: {
        src: 'loading-simulation.jpg',
        alt: 'Loading Image'
    }
};

export const ErrorState: Story = {
    args: {
        src: 'invalid-image.jpg',
        alt: 'Error Image'
    }
};