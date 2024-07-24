import { FieldRequest } from "./types";
type IsBoolean<T> = T extends boolean ? true : false;
type IsBothBooleans<T1, T2> = IsBoolean<T1> extends true ? IsBoolean<T2> extends true ? true : false : false;
type IsFieldRequest<T> = T extends FieldRequest ? true : false;
type IsBothFieldRequests<T1, T2> = IsFieldRequest<T1> extends true ? IsFieldRequest<T2> extends true ? true : false : false;
type Conform<T> = IsBoolean<T> extends true ? boolean : IsFieldRequest<T> extends true ? T : never;
type MergeInternal<T1, T2> = IsBothBooleans<T1, T2> extends true ? boolean : IsBothFieldRequests<T1, T2> extends true ? {
    [K in keyof T1 | keyof T2]: K extends keyof T1 ? K extends keyof T2 ? MergeInternal<T1[K], T2[K]> : Conform<T1[K]> : K extends keyof T2 ? Conform<T2[K]> : never;
} : never;
type Merge1<T> = IsFieldRequest<T> extends true ? T : never;
type Merge2<T1, T2> = IsBothFieldRequests<T1, T2> extends true ? MergeInternal<T1, T2> : never;
type Merge3<T1, T2, T3> = Merge2<Merge2<T1, T2>, T3>;
type Merge4<T1, T2, T3, T4> = Merge2<Merge2<T1, T2>, Merge2<T3, T4>>;
type Merge5<T1, T2, T3, T4, T5> = Merge3<Merge2<T1, T2>, Merge2<T3, T4>, T5>;
type Merge6<T1, T2, T3, T4, T5, T6> = Merge3<Merge2<T1, T2>, Merge2<T3, T4>, Merge2<T5, T6>>;
type Merge7<T1, T2, T3, T4, T5, T6, T7> = Merge4<Merge2<T1, T2>, Merge2<T3, T4>, Merge2<T5, T6>, T7>;
type Merge8<T1, T2, T3, T4, T5, T6, T7, T8> = Merge4<Merge2<T1, T2>, Merge2<T3, T4>, Merge2<T5, T6>, Merge2<T7, T8>>;
type Merge9<T1, T2, T3, T4, T5, T6, T7, T8, T9> = Merge5<Merge2<T1, T2>, Merge2<T3, T4>, Merge2<T5, T6>, Merge2<T7, T8>, T9>;
declare function merge1<T1 extends FieldRequest>(o1: T1): Merge1<T1>;
declare function merge2<T1 extends FieldRequest, T2 extends FieldRequest>(o1: T1, o2: T2): Merge2<T1, T2>;
declare const merge3: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3) => Merge2<Merge2<T1, T2>, T3>;
declare const merge4: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface, T4 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3, o4: T4) => Merge2<Merge2<T1, T2>, Merge2<T3, T4>>;
declare const merge5: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface, T4 extends import("./types").FieldRequestInterface, T5 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3, o4: T4, o5: T5) => Merge2<Merge2<Merge2<T1, T2>, Merge2<T3, T4>>, T5>;
declare const merge6: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface, T4 extends import("./types").FieldRequestInterface, T5 extends import("./types").FieldRequestInterface, T6 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3, o4: T4, o5: T5, o6: T6) => Merge2<Merge2<Merge2<T1, T2>, Merge2<T3, T4>>, Merge2<T5, T6>>;
declare const merge7: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface, T4 extends import("./types").FieldRequestInterface, T5 extends import("./types").FieldRequestInterface, T6 extends import("./types").FieldRequestInterface, T7 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3, o4: T4, o5: T5, o6: T6, o7: T7) => Merge2<Merge2<Merge2<T1, T2>, Merge2<T3, T4>>, Merge2<Merge2<T5, T6>, T7>>;
declare const merge8: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface, T4 extends import("./types").FieldRequestInterface, T5 extends import("./types").FieldRequestInterface, T6 extends import("./types").FieldRequestInterface, T7 extends import("./types").FieldRequestInterface, T8 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3, o4: T4, o5: T5, o6: T6, o7: T7, o8: T8) => Merge2<Merge2<Merge2<T1, T2>, Merge2<T3, T4>>, Merge2<Merge2<T5, T6>, Merge2<T7, T8>>>;
declare const merge9: <T1 extends import("./types").FieldRequestInterface, T2 extends import("./types").FieldRequestInterface, T3 extends import("./types").FieldRequestInterface, T4 extends import("./types").FieldRequestInterface, T5 extends import("./types").FieldRequestInterface, T6 extends import("./types").FieldRequestInterface, T7 extends import("./types").FieldRequestInterface, T8 extends import("./types").FieldRequestInterface, T9 extends import("./types").FieldRequestInterface>(o1: T1, o2: T2, o3: T3, o4: T4, o5: T5, o6: T6, o7: T7, o8: T8, o9: T9) => Merge2<Merge2<Merge2<Merge2<T1, T2>, Merge2<T3, T4>>, Merge2<Merge2<T5, T6>, Merge2<T7, T8>>>, T9>;
export { Merge1, merge1, Merge2, merge2, Merge3, merge3, Merge4, merge4, Merge5, merge5, Merge6, merge6, Merge7, merge7, Merge8, merge8, Merge9, merge9, };
