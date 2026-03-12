import HoverPreview from "./hover-preview";
import { HoverTarget } from "./hover-preview";

// Basic usage
const targets: HoverTarget[] = [
{
text: "React",
imageUrl: "https://example.com/react.jpg",
linkUrl: "https://react.dev",
},
{
text: "TypeScript",
imageUrl: "https://example.com/typescript.jpg",
linkUrl: "https://typescriptlang.org",
},
];

<HoverPreview
  content="Learn {0} and {1} for modern web development."
  targets={targets}
/>

// With custom callback and position
<HoverPreview
content="Hover over {0} or {1} to preview."
targets={targets}
imagePosition="below"
enterSpeed={0.3}
exitSpeed={0.2}
targetPadding={8}
onTargetClick={(target, index) => {
console.log('Clicked:', target.text);
}}
maxRotation={20}
maxOffset={25}
/>

// Custom styling and positioning
<HoverPreview
  content="Explore {0}, {1}, and {2}."
  targets={targets}
  imagePosition="right"
  enterSpeed={0.25}
  exitSpeed={0.15}
  targetPadding={6}
  imageWidth={300}
  imageHeight={300}
  imageBorderRadius="1.5rem"
  showImageShadow={true}
  className="text-xl font-medium"
  targetClassName="text-purple-600"
/>
