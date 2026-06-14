import processModule from "node:process";
// Keep a reference to the original process to avoid circular references after polyfilling
const originalProcess = globalThis["process"];
globalThis.process = originalProcess ? new Proxy(originalProcess, { get(target, prop, receiver) {
if (Reflect.has(target, prop)) {
// Use target (not the Proxy receiver) so getters relying on private
// class fields (e.g. process.stdout's #t) resolve against the real object.
return Reflect.get(target, prop, target);
}
// Fix the unenv proxy receiver bug by using processModule as the receiver instead of the proxied process object
return Reflect.get(processModule, prop, processModule);
} }) : processModule;
export default globalThis.process;
