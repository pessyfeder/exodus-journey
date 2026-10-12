# Plague image prompts

One image per plague. Save each as `src/assets/plagues/<filename>` (jpg, jpeg, png or webp). The app picks
them up automatically: the plague page, the chapter card and the reader all switch from the shared cover to
the new image. A plague with no file keeps the shared cover.

**Format:** landscape, 3:2 (for example 1536×1024), the same as the existing covers.

## Shared style (add to the start of every prompt)

> Cinematic, photorealistic historical epic, ancient Egypt, Late Bronze Age. Dramatic natural light, rich
> detail, shallow depth of field, film-still look, muted earthy palette with one strong accent colour. No
> text, no captions, no logos, no modern objects. Not graphic: no gore, no visible wounds, no corpses.

Match the project's earlier choice to leave women out of the images by adding **"Only men and boys appear
in the scene."** to each prompt where people appear. Remove it if you change your mind.

## Prompts

| # | File | Chapter | Prompt (after the shared style) |
|---|------|---------|---------------------------------|
| 1 | `water-into-blood.jpg` | Exodus 7:14–25 | The Nile at dusk turned deep red, still and glossy like blood, under heavy clouds. Dead fish float near reeds. Egyptian men on the bank stand back from the water in horror, hands over their mouths. A stone temple and palms in the background. Accent colour: blood red. |
| 2 | `frogs.jpg` | Exodus 8:1–15 | Hundreds of frogs pour out of a river and cover the stone steps and courtyard of an Egyptian house. Frogs on tables, in baskets and on the floor of a bread kitchen. A startled servant lifts his feet. Warm lamp light. Accent colour: wet green. |
| 3 | `lice.jpg` | Exodus 8:16–19 | A man in a priest's linen kilt strikes the dust of the ground with a rod, and the dust lifts into a shimmering swarm of tiny insects over a city street. Egyptian onlookers brush at their arms. Hazy, golden dust light. Accent colour: dusty gold. |
| 4 | `flies.jpg` | Exodus 8:20–32 | A dense swarm of flies fills the air of a palace courtyard, almost a dark cloud, blurring the columns and the throne. Servants wave cloths at the swarm. At the edge of the frame, a calm green field in the distance, untouched (the land of Goshen). Accent colour: smoky amber. |
| 5 | `livestock.jpg` | Exodus 9:1–7 | A silent pasture at dawn on the Egyptian side. Cattle stand still or lie sick in the grass, heads low, while herdsmen stand helpless and silent. Across a fence line, a healthy flock grazes in bright light. No visible blood or wounds. Accent colour: grey dawn mist. |
| 6 | `boils.jpg` | Exodus 9:8–12 | A man throws handfuls of furnace ash into the air toward the sky, and the ash drifts down over a courtyard. Egyptian magicians in robes shield their faces and stagger back. Do not show skin detail or sores. Smoky, ember-lit atmosphere. Accent colour: ash grey and ember orange. |
| 7 | `hail.jpg` | Exodus 9:13–35 | A violent storm over Egyptian farmland: huge hailstones and lightning, fire running along the ground, flax and barley flattened. Farmers run for shelter in a mud-brick barn. Far away to one side, a calm sky over a quiet village. Accent colour: storm blue-white with lightning. |
| 8 | `locusts.jpg` | Exodus 10:1–20 | A wall of locusts rolling across a field at sunset, so dense the sky turns brown. The fields below are stripped bare. Egyptian men look up in despair. Strong east wind visible in the dust. Accent colour: burnt orange. |
| 9 | `darkness.jpg` | Exodus 10:21–29 | A street in an Egyptian city in total, heavy darkness at midday. Men feel their way along walls with outstretched hands; lamps are dark. In the distance, a single window glows warm with light (the Israelite dwellings). Accent colour: deep black with one warm light. |
| 10 | `firstborn-passover.jpg` | Exodus 11:1–12:32 | A quiet night street in a village. A man in plain robes marks a doorpost with a bunch of hyssop dipped in a bowl, the dark mark clearly visible on the lintel and doorposts. A lamb is tied by the door. A pale moon overhead and a faint mist along the road. Calm and reverent, no violence or death shown. Accent colour: moonlight blue with a dark red doorpost mark. |

## Notes

- The prompts for plagues 5, 6 and 10 are written to avoid graphic content, in line with the About text
  ("the presentation avoids graphic imagery"). The earlier `plagues-cover-new.jpg` (mourning, bodies) is
  not used for that reason.
- The first plague uses the existing Nile cover until `water-into-blood.jpg` exists.
- After generating, check faces and hands; AI images often get them wrong.
