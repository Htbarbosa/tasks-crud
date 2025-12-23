// Application Layer - Use Case Interface
export interface IUseCase<TInput, TOutput> {
    execute(input: TInput): Promise<TOutput>;
}
