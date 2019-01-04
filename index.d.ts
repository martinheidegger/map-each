type callback <T> = (err?: Error, data?: T) => void
type straightCb = (err?: Error) => void
type straightProcess <InType> = (data: InType, callback: straightCb) => void
type process <InType, OutType> = (data: InType, callback: callback<OutType>) => void

export interface MapEach {
  <InType> (items: Iterable<InType>, process: straightProcess<InType>, next: straightCb): void
  <InType> (items: Iterable<InType>, process: straightProcess<InType>, concurrency: number, next: straightCb): void
  <InType> (items: Iterable<InType>, process: straightProcess<InType>, next: straightCb, concurrency: number): void

  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, next: null | undefined): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, next: callback<Iterable<OutType>>): void
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, concurrency: number): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, concurrency: number, next: callback<Iterable<OutType>>): void
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, concurrency: number, next: null | undefined): Promise<Iterable<OutType>>
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, next: callback<Iterable<OutType>>, concurrency: number): void
  <InType, OutType> (items: Iterable<InType>, process: process<InType, OutType>, next: null | undefined, concurrency: number): Promise<Iterable<OutType>>
}

export declare const mapEach: MapEach
