# node-red-contrib-remote-io

# Description:
	[Node-RED](http://nodered.org/) nodes to easily use WAGO 750 Modules. 

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
	NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Author: 
	"Jesse James Cox (https://github.com/jessejamescox), (https://www.npmjs.com/~jessejamescox)",
	"Kurtl Braun (https://github.com/), (https://www.npmjs.com/~kurtlbraun)",
	"Christophe Icard (https://github.com/Ekristoffe), (https://www.npmjs.com/~ekristoffe)"
	
# Typical pitfall:
	With 750-3xx or 750-8xx
	You dial with a WAGO Ethernet controller.
	Try to set outputs - but nothing happens!
	WAGO Ethernet controller provide a "owner" policy for physical outputs.
	The "owner" could be CoDeSys-Runtime or Fieldbus-Master.
	Every time you download a PLC program the CoDeSys-Runtime becomes "owner" of physical outputs.
	Use tool "WAGO Ethernet Settings" and do "Reset File System",
	it is the easiest way to assign Modbus-Master as "owner".
	Alternatively you can "Login" with CoDeSys-IDE and perform "Reset(original)".

	With 750-8xxx
	By default there is no Modbus server available, you must use e!Cockpit to create your own Modbus server.
	
# Example
##Example
![Example](https://github.com/Ekristoffe/node-red-contrib-remote-io/blob/master/wago/icons/old/flow_example.png)

![Example](https://github.com/Ekristoffe/node-red-contrib-remote-io/blob/master/wago/icons/old/flow_example2.png)

	https://github.com/Ekristoffe/node-red-contrib-remote-io/blob/master/wago/icons/old/flow_example.png

	https://github.com/Ekristoffe/node-red-contrib-remote-io/blob/master/wago/icons/old/flow_example2.png

	Remote IO nodes make it simple to receive and send data in/out of Modbus registers.  Scaling functions and diagnostics are built in where available.

# Release Note
	Version: 1.1.0.4 (01.08.2019)
	- Global cleanup and use the C# Coding Standards and Naming Conventions
* 0.0.1	First release
* 0.0.2	package.json updated
* 0.0.3	Readme and package.json updated
* 0.0.4	Readme and package.json updated
* 0.0.5	Readme and package.json updated
* 0.0.6	Nodes color change + package.json updated
* 0.0.7	Readme and package.json updated
* 0.0.8	Temperature and package.json updated
* 0.0.9	Analog output fixed to fload + Nodes color change + package.json updated
* 0.1.0	New licenceAnalog output fixed to fload + Nodes color change + package.json updated
* 0.1.4	AI, AO, DI, DO, Temp, 750-49x, 753-647 deep update
  * Tested 10/28/2016
