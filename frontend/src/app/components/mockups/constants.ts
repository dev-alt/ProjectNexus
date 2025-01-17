// components/mockups/constants.ts
import { MockupType } from "@/types/mockup";

export type MockupFilterType = MockupType | 'All Types';

export const MOCKUP_FILTER_TYPES: ReadonlyArray<MockupFilterType> = [
    'All Types',
    'Wireframe',
    'Prototype',
    'High-fidelity'
] as const;
