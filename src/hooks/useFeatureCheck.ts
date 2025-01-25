// hooks/useFeatureCheck.ts
import { useState, useEffect } from 'react';
import { FeatureCheckHook, FeatureAccess } from '../types/feature-check';

async function checkFeatureAccess(clubId: string, featureKey: string): Promise<FeatureAccess> {
    const response = await fetch(`/api/features/check?clubId=${clubId}&key=${featureKey}`);
    if (!response.ok) throw new Error('Feature check failed');
    return response.json();
}

export function useFeatureCheck(clubId: string, featureKey: string): FeatureCheckHook {
    const [state, setState] = useState<FeatureCheckHook>({
        isAllowed: false,
        limit: 0,
        current: 0,
        isLoading: true
    });

    useEffect(() => {
        let mounted = true;

        async function checkAccess() {
            try {
                const result = await checkFeatureAccess(clubId, featureKey);
                if (mounted) {
                    setState({
                        isAllowed: result.allowed,
                        limit: result.limit || 0,
                        current: result.current || 0,
                        isLoading: false
                    });
                }
            } catch (error) {
                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: error instanceof Error ? error : new Error('Unknown error')
                    }));
                }
            }
        }

        checkAccess();
        return () => { mounted = false; };
    }, [clubId, featureKey]);

    return state;
}