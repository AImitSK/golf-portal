export interface SanityRule {
    required: () => SanityRule;
    custom: (fn: (value: any) => true | string) => SanityRule;
    regex: (pattern: RegExp) => SanityRule;
}
