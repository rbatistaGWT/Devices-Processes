<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <alerts>
        <fullName>New_Patient_For_Site_Alert</fullName>
        <description>New Patient For Site Alert</description>
        <protected>false</protected>
        <recipients>
            <type>accountOwner</type>
        </recipients>
        <recipients>
            <type>creator</type>
        </recipients>
        <senderType>CurrentUser</senderType>
        <template>DW_Folder/New_Patient_For_Site</template>
    </alerts>
    <fieldUpdates>
        <fullName>Set_Patient_Number</fullName>
        <field>Name</field>
        <formula>Patient_Id2__c</formula>
        <name>Set Patient Number</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Set Patient Number</fullName>
        <actions>
            <name>Set_Patient_Number</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <description>This workflow automates the &quot;Patient Number&quot; (Name) field on Patient Creation</description>
        <formula>NOT(ISNULL(Name))</formula>
        <triggerType>onCreateOnly</triggerType>
    </rules>
</Workflow>
