const gradients = [
  'from-[#FF0080] via-[#FF4D4D] to-[#FF8C00]',
  'from-[#7928CA] via-[#FF0080] to-[#FF4D4D]',
  'from-[#00DFD8] via-[#007CF0] to-[#00DFD8]',
  'from-[#7928CA] via-[#FF0080] to-[#FF0080]',
  'from-[#FF4D4D] via-[#F9CB28] to-[#FF4D4D]',
  'from-[#00DFD8] via-[#00B4D8] to-[#0077B6]',
  'from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]',
  'from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]'
];

export function getRandomGradient(): string {
  return gradients[Math.floor(Math.random() * gradients.length)];
}