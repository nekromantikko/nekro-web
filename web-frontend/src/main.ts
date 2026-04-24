import './style.css';
import { startRenderer } from './ascii-renderer';

const outputEl = document.getElementById('ascii-output')!;
startRenderer(outputEl);
