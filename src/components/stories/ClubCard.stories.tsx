// src/stories/ClubCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ClubCard } from '@/components/clubs/ClubCard';

const meta: Meta<typeof ClubCard> = {
    title: 'Components/ClubCard',
    component: ClubCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        layout: {
            control: 'radio',
            options: ['large', 'compact'],
        },
        onTagClick: { action: 'tagClicked' }
    }
};

export default meta;
type Story = StoryObj<typeof ClubCard>;

const mockClub = {
    _id: 'test-id',
    title: 'Golfclub Musterstadt',
    slug: 'golfclub-musterstadt',
    city: 'Musterstadt',
    image: '/sample-golf-course.jpg',
    adresse: {
        city: 'Musterstadt',
        location: { lat: 50, lng: 10 }
    },
    anzahlLoecher: 18,
    parGesamt: 72,
    laengeMeter: 6200,
    handicapBeschraenkung: 54,
    courseRating: 72.3,
    slope: 133,
    platztyp: 'Parkland',
    besonderheiten: ['Wasserhindernisse', 'Driving Range'],
    aktuellesModell: { name: 'PREMIUM' }
};

export const Large: Story = {
    args: {
        club: mockClub,
        layout: 'large'
    }
};

export const Compact: Story = {
    args: {
        club: mockClub,
        layout: 'compact'
    }
};

export const WithoutImage: Story = {
    args: {
        club: { ...mockClub, image: undefined },
        layout: 'large'
    }
};

export const Loading: Story = {
    args: {
        club: { ...mockClub, image: 'loading-test.jpg' },
        layout: 'large'
    }
};