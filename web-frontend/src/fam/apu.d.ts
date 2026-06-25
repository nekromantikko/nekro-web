export type ChannelId = 'pulse1' | 'pulse2' | 'triangle' | 'noise';

export interface Channel {
    enabled: boolean,
}

export interface PulseChannel extends Channel {
    volume: number,
    constantVolume: boolean,
    loop: boolean,
    dutyCycle: number,

    sweepShift: number,
    sweepNegate: boolean,
    sweepPeriod: number,
    sweepEnabled: boolean,

    timerPeriod: number,
    lengthCounterLoad: number
}

export interface TriangleChannel extends Channel {
    linearCounterLoad: number,
    loop: boolean,

    timerPeriod: number,
    lengthCounterLoad: number
}

export interface NoiseChannel extends Channel {
    volume: number,
    constantVolume: boolean,
    loop: boolean,

    period: number,
    mode: boolean,

    lengthCounterLoad: number
}

export type ApuState = {
    pulse1: PulseChannel,
    pulse2: PulseChannel,
    triangle: TriangleChannel,
    noise: NoiseChannel
}