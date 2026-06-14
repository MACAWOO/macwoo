import processModule from "node:process";
// Keep a reference to the original process to avoid circular references after polyfilling
const originalProcess = globalThis["process"];
globalThis.process = originalProcess ? new Proxy(originalProcess, { get(target, prop, receiver) {
if (Reflect.has(target, prop)) {
return Reflect.get(target, prop, receiver);
}
// Fix the unenv proxy receiver bug by using processModule as the receiver instead of the proxied process object
return Reflect.get(processModule, prop, processModule);
} }) : processModule;
export default globalThis.process;
