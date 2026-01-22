import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Let Remotion download browser automatically
Config.setBrowserExecutable(null);
